<?php



require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth.php';

$admin = authenticate();
$method = $_SERVER['REQUEST_METHOD'];
$pathExtra = $_SERVER['PATH_EXTRA'] ?? '';
$db = get_db_connection();

// ── GET /api/admin/products — list all products (including inactive) ──
if ($method === 'GET' && $pathExtra === '') {
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $perPage;

    $where = ['1=1'];
    $params = [];

    if (!empty($_GET['brand'])) {
        $where[] = 'b.slug = :brand';
        $params['brand'] = $_GET['brand'];
    }
    if (!empty($_GET['category'])) {
        $where[] = 'c.slug = :category';
        $params['category'] = $_GET['category'];
    }
    if (!empty($_GET['search'])) {
        $where[] = 'p.name LIKE :search';
        $params['search'] = '%' . $_GET['search'] . '%';
    }
    if (isset($_GET['active'])) {
        $where[] = 'p.is_active = :active';
        $params['active'] = (int) $_GET['active'];
    }

    $whereClause = implode(' AND ', $where);

    $countStmt = $db->prepare("
        SELECT COUNT(*) FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE {$whereClause}
    ");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $stmt = $db->prepare("
        SELECT p.*, b.name AS brand_name, c.name AS category_name,
               (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_default = 1 LIMIT 1) AS default_price
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE {$whereClause}
        ORDER BY p.created_at DESC
        LIMIT {$perPage} OFFSET {$offset}
    ");
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    foreach ($products as &$product) {
        $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : null;
        $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
    }
    unset($product);

    json_response([
        'products'    => $products,
        'total'       => $total,
        'page'        => $page,
        'per_page'    => $perPage,
        'total_pages' => (int) ceil($total / $perPage),
    ]);
}

// ── GET /api/admin/products/{id} — single product by ID ──
if ($method === 'GET' && $pathExtra !== '') {
    $id = (int) $pathExtra;

    $stmt = $db->prepare("
        SELECT p.*, b.name AS brand_name, c.name AS category_name
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = :id
        LIMIT 1
    ");
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch();

    if (!$product) {
        error_response('Product not found', 404);
    }

    $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : null;
    $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];

    // Fetch variants
    $vstmt = $db->prepare("SELECT * FROM product_variants WHERE product_id = :pid ORDER BY is_default DESC, price ASC");
    $vstmt->execute(['pid' => $id]);
    $product['variants'] = $vstmt->fetchAll();

    json_response($product);
}

// ── POST /api/admin/products — create product ──
if ($method === 'POST') {
    $data = get_json_body();

    $missing = validate_required(['name', 'slug', 'brand_id', 'category_id'], $data);
    if (!empty($missing)) {
        error_response('Missing required fields: ' . implode(', ', $missing));
    }

    // Check slug uniqueness
    $check = $db->prepare("SELECT id FROM products WHERE slug = :slug");
    $check->execute(['slug' => $data['slug']]);
    if ($check->fetch()) {
        error_response('Product slug already exists');
    }

    $db->beginTransaction();

    try {
        $stmt = $db->prepare("
            INSERT INTO products (brand_id, category_id, name, slug, description, specs, colors, image_url, images, badge, is_featured, is_active, sort_order)
            VALUES (:brand_id, :category_id, :name, :slug, :description, :specs, :colors, :image_url, :images, :badge, :is_featured, :is_active, :sort_order)
        ");
        $stmt->execute([
            'brand_id'    => (int) $data['brand_id'],
            'category_id' => (int) $data['category_id'],
            'name'        => trim($data['name']),
            'slug'        => trim($data['slug']),
            'description' => trim($data['description'] ?? ''),
            'specs'       => isset($data['specs']) ? json_encode($data['specs']) : null,
            'colors'      => trim($data['colors'] ?? ''),
            'image_url'   => trim($data['image_url'] ?? ''),
            'images'      => isset($data['images']) ? json_encode($data['images']) : null,
            'badge'       => trim($data['badge'] ?? ''),
            'is_featured' => (int) ($data['is_featured'] ?? 0),
            'is_active'   => (int) ($data['is_active'] ?? 1),
            'sort_order'  => (int) ($data['sort_order'] ?? 0),
        ]);

        $productId = (int) $db->lastInsertId();

        // Insert variants if provided
        if (!empty($data['variants']) && is_array($data['variants'])) {
            $vStmt = $db->prepare("
                INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, original_price, stock_status, is_default)
                VALUES (:product_id, :ram, :storage, :storage_unit, :price, :original_price, :stock_status, :is_default)
            ");

            foreach ($data['variants'] as $v) {
                $vStmt->execute([
                    'product_id'     => $productId,
                    'ram'            => trim($v['ram'] ?? ''),
                    'storage'        => trim($v['storage'] ?? ''),
                    'storage_unit'   => trim($v['storage_unit'] ?? 'GB'),
                    'price'          => (float) $v['price'],
                    'original_price' => isset($v['original_price']) ? (float) $v['original_price'] : null,
                    'stock_status'   => $v['stock_status'] ?? 'in_stock',
                    'is_default'     => (int) ($v['is_default'] ?? 0),
                ]);
            }
        }

        $db->commit();

        json_response(['id' => $productId, 'slug' => $data['slug']], 201);

    } catch (Throwable $e) {
        $db->rollBack();
        error_response('Failed to create product: ' . $e->getMessage(), 500);
    }
}

// ── PUT /api/admin/products/{id} — update product ──
if ($method === 'PUT' && $pathExtra !== '') {
    $id = (int) $pathExtra;
    $data = get_json_body();

    // Check product exists
    $check = $db->prepare("SELECT id FROM products WHERE id = :id");
    $check->execute(['id' => $id]);
    if (!$check->fetch()) {
        error_response('Product not found', 404);
    }

    // Check slug uniqueness if slug is being changed
    if (!empty($data['slug'])) {
        $slugCheck = $db->prepare("SELECT id FROM products WHERE slug = :slug AND id != :id");
        $slugCheck->execute(['slug' => $data['slug'], 'id' => $id]);
        if ($slugCheck->fetch()) {
            error_response('Product slug already exists');
        }
    }

    $db->beginTransaction();

    try {
        // Build dynamic update
        $fields = [];
        $params = ['id' => $id];

        $allowedFields = [
            'brand_id', 'category_id', 'name', 'slug', 'description', 'colors',
            'image_url', 'badge', 'is_featured', 'is_active', 'sort_order',
        ];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = :{$field}";
                $params[$field] = $data[$field];
            }
        }

        // Handle JSON fields specially
        if (array_key_exists('specs', $data)) {
            $fields[] = 'specs = :specs';
            $params['specs'] = is_array($data['specs']) ? json_encode($data['specs']) : $data['specs'];
        }
        if (array_key_exists('images', $data)) {
            $fields[] = 'images = :images';
            $params['images'] = is_array($data['images']) ? json_encode($data['images']) : $data['images'];
        }

        if (!empty($fields)) {
            $fieldStr = implode(', ', $fields);
            $stmt = $db->prepare("UPDATE products SET {$fieldStr} WHERE id = :id");
            $stmt->execute($params);
        }

        // Replace variants if provided
        if (isset($data['variants']) && is_array($data['variants'])) {
            $db->prepare("DELETE FROM product_variants WHERE product_id = :pid")->execute(['pid' => $id]);

            $vStmt = $db->prepare("
                INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, original_price, stock_status, is_default)
                VALUES (:product_id, :ram, :storage, :storage_unit, :price, :original_price, :stock_status, :is_default)
            ");

            foreach ($data['variants'] as $v) {
                $vStmt->execute([
                    'product_id'     => $id,
                    'ram'            => trim($v['ram'] ?? ''),
                    'storage'        => trim($v['storage'] ?? ''),
                    'storage_unit'   => trim($v['storage_unit'] ?? 'GB'),
                    'price'          => (float) $v['price'],
                    'original_price' => isset($v['original_price']) ? (float) $v['original_price'] : null,
                    'stock_status'   => $v['stock_status'] ?? 'in_stock',
                    'is_default'     => (int) ($v['is_default'] ?? 0),
                ]);
            }
        }

        $db->commit();

        json_response(['id' => $id, 'updated' => true]);

    } catch (Throwable $e) {
        $db->rollBack();
        error_response('Failed to update product: ' . $e->getMessage(), 500);
    }
}

// ── DELETE /api/admin/products/{id} — soft delete ──
if ($method === 'DELETE' && $pathExtra !== '') {
    $id = (int) $pathExtra;

    $stmt = $db->prepare("UPDATE products SET is_active = 0 WHERE id = :id");
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() === 0) {
        error_response('Product not found', 404);
    }

    json_response(['id' => $id, 'deleted' => true]);
}

error_response('Method not allowed', 405);
