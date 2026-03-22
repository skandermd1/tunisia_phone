<?php



require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

$admin = authenticate();
$method = $_SERVER['REQUEST_METHOD'];
$pathExtra = $_SERVER['PATH_EXTRA'] ?? '';
$db = get_db_connection();

// ── GET /api/admin/orders — list orders with filters ──
if ($method === 'GET' && $pathExtra === '') {
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(100, max(1, (int) ($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $perPage;

    $where = ['1=1'];
    $params = [];

    if (!empty($_GET['status'])) {
        $where[] = 'o.status = :status';
        $params['status'] = $_GET['status'];
    }

    if (!empty($_GET['search'])) {
        $where[] = '(o.order_number LIKE :search OR o.customer_name LIKE :search2 OR o.customer_phone LIKE :search3)';
        $params['search'] = '%' . $_GET['search'] . '%';
        $params['search2'] = '%' . $_GET['search'] . '%';
        $params['search3'] = '%' . $_GET['search'] . '%';
    }

    if (!empty($_GET['date_from'])) {
        $where[] = 'o.created_at >= :date_from';
        $params['date_from'] = $_GET['date_from'];
    }

    if (!empty($_GET['date_to'])) {
        $where[] = 'o.created_at <= :date_to';
        $params['date_to'] = $_GET['date_to'] . ' 23:59:59';
    }

    $whereClause = implode(' AND ', $where);

    $countStmt = $db->prepare("SELECT COUNT(*) FROM orders o WHERE {$whereClause}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $stmt = $db->prepare("
        SELECT o.*,
               (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS items_count
        FROM orders o
        WHERE {$whereClause}
        ORDER BY o.created_at DESC
        LIMIT {$perPage} OFFSET {$offset}
    ");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    json_response([
        'orders'      => $orders,
        'total'       => $total,
        'page'        => $page,
        'per_page'    => $perPage,
        'total_pages' => (int) ceil($total / $perPage),
    ]);
}

// ── GET /api/admin/orders/{id} — single order with items ──
if ($method === 'GET' && $pathExtra !== '') {
    $id = (int) $pathExtra;

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $order = $stmt->fetch();

    if (!$order) {
        error_response('Order not found', 404);
    }

    $itemStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = :oid");
    $itemStmt->execute(['oid' => $id]);
    $order['items'] = $itemStmt->fetchAll();

    json_response($order);
}

// ── PUT /api/admin/orders/{id} — update order status ──
if ($method === 'PUT' && $pathExtra !== '') {
    $id = (int) $pathExtra;
    $data = get_json_body();

    if (empty($data['status'])) {
        error_response('Status is required');
    }

    $validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($data['status'], $validStatuses, true)) {
        error_response('Invalid status. Allowed: ' . implode(', ', $validStatuses));
    }

    $stmt = $db->prepare("UPDATE orders SET status = :status WHERE id = :id");
    $stmt->execute(['status' => $data['status'], 'id' => $id]);

    if ($stmt->rowCount() === 0) {
        error_response('Order not found', 404);
    }

    json_response(['id' => $id, 'status' => $data['status']]);
}

error_response('Method not allowed', 405);
