<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

$method = $_SERVER['REQUEST_METHOD'];
$slug = $_SERVER['PATH_EXTRA'] ?? '';

if ($method !== 'GET') {
    error_response('Method not allowed', 405);
}

$db = get_db_connection();

// GET /api/products/{slug} — single product by slug
if ($slug !== '') {
    $stmt = $db->prepare("
        SELECT p.*, b.name AS brand_name, b.slug AS brand_slug,
               c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = :slug AND p.is_active = 1
        LIMIT 1
    ");
    $stmt->execute(['slug' => $slug]);
    $product = $stmt->fetch();

    if (!$product) {
        error_response('Product not found', 404);
    }

    // Decode JSON fields
    $product['specs'] = $product['specs'] ? json_decode($product['specs'], true) : null;
    $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
    $product['colors'] = $product['colors'] ? json_decode($product['colors'], true) : [];

    // Nest brand and category
    $product['brand'] = [
        'id' => $product['brand_id'],
        'name' => $product['brand_name'],
        'slug' => $product['brand_slug'],
    ];
    $product['category'] = [
        'id' => $product['category_id'],
        'name' => $product['category_name'],
        'slug' => $product['category_slug'],
    ];
    unset($product['brand_name'], $product['brand_slug'], $product['category_name'], $product['category_slug']);

    // Fetch variants
    $vstmt = $db->prepare("
        SELECT id, ram, storage, storage_unit, price, original_price, stock_status, is_default
        FROM product_variants
        WHERE product_id = :pid
        ORDER BY is_default DESC, price ASC
    ");
    $vstmt->execute(['pid' => $product['id']]);
    $product['variants'] = $vstmt->fetchAll();

    json_response($product);
}

// GET /api/products — list with filters
$where = ['p.is_active = 1'];
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
    $where[] = '(p.name LIKE :search OR p.description LIKE :search2)';
    $params['search'] = '%' . $_GET['search'] . '%';
    $params['search2'] = '%' . $_GET['search'] . '%';
}

if (isset($_GET['featured']) && $_GET['featured'] === '1') {
    $where[] = 'p.is_featured = 1';
}

$whereClause = implode(' AND ', $where);

// Pagination
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 20)));
$offset = ($page - 1) * $perPage;

// Sorting
$sortMap = [
    'newest'     => 'p.created_at DESC',
    'oldest'     => 'p.created_at ASC',
    'name_asc'   => 'p.name ASC',
    'name_desc'  => 'p.name DESC',
    'price_asc'  => 'default_price ASC',
    'price_desc' => 'default_price DESC',
];
$sort = $sortMap[$_GET['sort'] ?? ''] ?? 'p.sort_order ASC, p.created_at DESC';

// Count total
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE {$whereClause}
");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

// Fetch products with default variant price
$stmt = $db->prepare("
    SELECT p.id, p.name, p.slug, p.description, p.image_url, p.images, p.badge,
           p.is_featured, p.colors,
           b.name AS brand_name, b.slug AS brand_slug,
           c.name AS category_name, c.slug AS category_slug,
           (SELECT pv.price FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_default = 1 LIMIT 1) AS default_price,
           (SELECT pv.original_price FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_default = 1 LIMIT 1) AS default_original_price
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE {$whereClause}
    ORDER BY {$sort}
    LIMIT {$perPage} OFFSET {$offset}
");
$stmt->execute($params);
$products = $stmt->fetchAll();

// Decode JSON fields and nest brand/category
foreach ($products as &$product) {
    $product['images'] = $product['images'] ? json_decode($product['images'], true) : [];
    $product['colors'] = $product['colors'] ? json_decode($product['colors'], true) : [];
    $product['brand'] = [
        'id' => $product['brand_id'] ?? null,
        'name' => $product['brand_name'],
        'slug' => $product['brand_slug'],
    ];
    $product['category'] = [
        'id' => $product['category_id'] ?? null,
        'name' => $product['category_name'],
        'slug' => $product['category_slug'],
    ];
    unset($product['brand_name'], $product['brand_slug'], $product['category_name'], $product['category_slug']);
}
unset($product);

json_response([
    'products'    => $products,
    'pagination'  => [
        'total'       => $total,
        'page'        => $page,
        'per_page'    => $perPage,
        'total_pages' => (int) ceil($total / $perPage),
    ],
]);
