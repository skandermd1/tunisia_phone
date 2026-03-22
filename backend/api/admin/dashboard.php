<?php



require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

$admin = authenticate();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error_response('Method not allowed', 405);
}

$db = get_db_connection();

// Total orders
$totalOrders = (int) $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();

// Pending orders
$pendingOrders = (int) $db->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();

// Total revenue (from delivered orders)
$revenue = (float) $db->query("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'delivered'")->fetchColumn();

// Total active products
$totalProducts = (int) $db->query("SELECT COUNT(*) FROM products WHERE is_active = 1")->fetchColumn();

// Recent 5 orders
$recentStmt = $db->query("
    SELECT id, order_number, customer_name, total, status, created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 5
");
$recentOrders = $recentStmt->fetchAll();

// Orders by status breakdown
$statusStmt = $db->query("
    SELECT status, COUNT(*) AS count
    FROM orders
    GROUP BY status
");
$ordersByStatus = [];
foreach ($statusStmt->fetchAll() as $row) {
    $ordersByStatus[$row['status']] = (int) $row['count'];
}

json_response([
    'total_orders'    => $totalOrders,
    'pending_orders'  => $pendingOrders,
    'total_revenue'   => $revenue,
    'total_products'  => $totalProducts,
    'recent_orders'   => $recentOrders,
    'orders_by_status' => $ordersByStatus,
]);
