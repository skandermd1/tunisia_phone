<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';

$method = $_SERVER['REQUEST_METHOD'];
$pathExtra = $_SERVER['PATH_EXTRA'] ?? '';
$db = get_db_connection();

// GET /api/orders/track/{order_number} — track order by order number
if ($method === 'GET') {
    // Expect path like: track/TP-20260322-0001
    if (!str_starts_with($pathExtra, 'track/')) {
        error_response('Use GET /api/orders/track/{order_number} to track an order', 400);
    }

    $orderNumber = substr($pathExtra, 6); // strip "track/"

    if ($orderNumber === '') {
        error_response('Order number is required', 400);
    }

    $stmt = $db->prepare("
        SELECT id, order_number, customer_name, status, subtotal, total, created_at, updated_at
        FROM orders
        WHERE order_number = :order_number
        LIMIT 1
    ");
    $stmt->execute(['order_number' => $orderNumber]);
    $order = $stmt->fetch();

    if (!$order) {
        error_response('Order not found', 404);
    }

    // Fetch order items
    $itemStmt = $db->prepare("
        SELECT product_name, variant_label, price, quantity
        FROM order_items
        WHERE order_id = :oid
    ");
    $itemStmt->execute(['oid' => $order['id']]);
    $order['items'] = $itemStmt->fetchAll();

    // Remove internal id from public response
    unset($order['id']);

    json_response($order);
}

// POST /api/orders — create new order
if ($method === 'POST') {
    $data = get_json_body();

    $missing = validate_required(['customer_name', 'customer_phone', 'customer_address', 'items'], $data);
    if (!empty($missing)) {
        error_response('Missing required fields: ' . implode(', ', $missing));
    }

    if (!validate_phone($data['customer_phone'])) {
        error_response('Invalid Tunisian phone number (must be 8 digits)');
    }

    if (!is_array($data['items']) || empty($data['items'])) {
        error_response('Order must contain at least one item');
    }

    // Validate each item has a variant_id and optional quantity
    foreach ($data['items'] as $i => $item) {
        if (empty($item['variant_id'])) {
            error_response("Item at index {$i} is missing variant_id");
        }
    }

    $db->beginTransaction();

    try {
        // Generate order number: TP-YYYYMMDD-XXXX
        $today = date('Ymd');
        $countStmt = $db->prepare("
            SELECT COUNT(*) FROM orders WHERE order_number LIKE :prefix
        ");
        $countStmt->execute(['prefix' => "TP-{$today}-%"]);
        $dayCount = (int) $countStmt->fetchColumn() + 1;
        $orderNumber = sprintf('TP-%s-%04d', $today, $dayCount);

        // Resolve items: fetch variant + product info, compute subtotal
        $subtotal = 0;
        $resolvedItems = [];

        foreach ($data['items'] as $item) {
            $variantId = (int) $item['variant_id'];
            $qty = max(1, (int) ($item['quantity'] ?? 1));

            $vstmt = $db->prepare("
                SELECT pv.id AS variant_id, pv.product_id, pv.price, pv.ram, pv.storage,
                       pv.storage_unit, pv.stock_status, p.name AS product_name
                FROM product_variants pv
                JOIN products p ON p.id = pv.product_id
                WHERE pv.id = :vid
                LIMIT 1
            ");
            $vstmt->execute(['vid' => $variantId]);
            $variant = $vstmt->fetch();

            if (!$variant) {
                throw new RuntimeException("Variant ID {$variantId} not found");
            }

            if ($variant['stock_status'] === 'out_of_stock') {
                throw new RuntimeException("Product \"{$variant['product_name']}\" is out of stock");
            }

            $variantLabel = trim("{$variant['ram']} / {$variant['storage']}{$variant['storage_unit']}");
            $lineTotal = (float) $variant['price'] * $qty;
            $subtotal += $lineTotal;

            $resolvedItems[] = [
                'product_id'   => $variant['product_id'],
                'variant_id'   => $variant['variant_id'],
                'product_name' => $variant['product_name'],
                'variant_label' => $variantLabel,
                'price'        => $variant['price'],
                'quantity'     => $qty,
            ];
        }

        $total = $subtotal; // Can add delivery fees later

        // Insert order
        $orderStmt = $db->prepare("
            INSERT INTO orders (order_number, customer_name, customer_phone, customer_address,
                                customer_city, customer_governorate, notes, subtotal, total)
            VALUES (:order_number, :name, :phone, :address, :city, :governorate, :notes, :subtotal, :total)
        ");
        $orderStmt->execute([
            'order_number' => $orderNumber,
            'name'         => trim($data['customer_name']),
            'phone'        => trim($data['customer_phone']),
            'address'      => trim($data['customer_address']),
            'city'         => trim($data['customer_city'] ?? ''),
            'governorate'  => trim($data['customer_governorate'] ?? ''),
            'notes'        => trim($data['notes'] ?? ''),
            'subtotal'     => $subtotal,
            'total'        => $total,
        ]);

        $orderId = (int) $db->lastInsertId();

        // Insert order items
        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_label, price, quantity)
            VALUES (:order_id, :product_id, :variant_id, :product_name, :variant_label, :price, :quantity)
        ");

        foreach ($resolvedItems as $ri) {
            $itemStmt->execute([
                'order_id'      => $orderId,
                'product_id'    => $ri['product_id'],
                'variant_id'    => $ri['variant_id'],
                'product_name'  => $ri['product_name'],
                'variant_label' => $ri['variant_label'],
                'price'         => $ri['price'],
                'quantity'      => $ri['quantity'],
            ]);
        }

        $db->commit();

        json_response([
            'order_number' => $orderNumber,
            'total'        => $total,
            'status'       => 'pending',
            'items_count'  => count($resolvedItems),
        ], 201);

    } catch (RuntimeException $e) {
        $db->rollBack();
        error_response($e->getMessage());
    } catch (Throwable $e) {
        $db->rollBack();
        error_response('Failed to create order', 500);
    }
}

error_response('Method not allowed', 405);
