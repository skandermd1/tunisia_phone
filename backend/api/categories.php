<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error_response('Method not allowed', 405);
}

$db = get_db_connection();

$stmt = $db->query("
    SELECT c.id, c.name, c.slug, c.icon, c.sort_order,
           COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
");

$categories = $stmt->fetchAll();

json_response($categories);
