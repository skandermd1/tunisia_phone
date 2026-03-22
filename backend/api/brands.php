<?php



require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error_response('Method not allowed', 405);
}

$db = get_db_connection();

$stmt = $db->query("
    SELECT b.id, b.name, b.slug, b.logo_url, b.sort_order,
           COUNT(p.id) AS product_count
    FROM brands b
    LEFT JOIN products p ON p.brand_id = b.id AND p.is_active = 1
    GROUP BY b.id
    ORDER BY b.sort_order ASC, b.name ASC
");

$brands = $stmt->fetchAll();

json_response($brands);
