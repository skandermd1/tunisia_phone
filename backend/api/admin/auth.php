<?php

declare(strict_types=1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../helpers/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_response('Method not allowed', 405);
}

$data = get_json_body();

$missing = validate_required(['username', 'password'], $data);
if (!empty($missing)) {
    error_response('Missing required fields: ' . implode(', ', $missing));
}

$db = get_db_connection();

$stmt = $db->prepare("
    SELECT id, username, password_hash, display_name
    FROM admin_users
    WHERE username = :username
    LIMIT 1
");
$stmt->execute(['username' => trim($data['username'])]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($data['password'], $admin['password_hash'])) {
    error_response('Invalid username or password', 401);
}

// Update last login
$db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id")
    ->execute(['id' => $admin['id']]);

// Generate JWT
$payload = [
    'sub'          => $admin['id'],
    'username'     => $admin['username'],
    'display_name' => $admin['display_name'],
    'iat'          => time(),
    'exp'          => time() + JWT_EXPIRY,
];

$token = jwt_encode($payload, JWT_SECRET);

json_response([
    'token'        => $token,
    'admin'        => [
        'id'           => $admin['id'],
        'username'     => $admin['username'],
        'name'         => $admin['display_name'],
    ],
    'expires_in'   => JWT_EXPIRY,
]);
