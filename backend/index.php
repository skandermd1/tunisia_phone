<?php

declare(strict_types=1);

// Front controller — routes all /api/* requests to handler files

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/helpers/response.php';

// Apply CORS headers on every request
apply_cors_headers();

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Parse the request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip base path (e.g., /backend or /api prefix depending on server config)
// Normalize: remove trailing slash, ensure leading slash
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$path = substr($uri, strlen($basePath));
$path = '/' . trim($path, '/');

$method = $_SERVER['REQUEST_METHOD'];

// Route map
$routes = [
    // Public endpoints
    '/api/products'    => __DIR__ . '/api/products.php',
    '/api/categories'  => __DIR__ . '/api/categories.php',
    '/api/brands'      => __DIR__ . '/api/brands.php',
    '/api/orders'      => __DIR__ . '/api/orders.php',

    // Admin endpoints
    '/api/admin/login'     => __DIR__ . '/api/admin/auth.php',
    '/api/admin/auth'      => __DIR__ . '/api/admin/auth.php',
    '/api/admin/products'  => __DIR__ . '/api/admin/products.php',
    '/api/admin/orders'    => __DIR__ . '/api/admin/orders.php',
    '/api/admin/dashboard' => __DIR__ . '/api/admin/dashboard.php',
];

// Match route — try exact match first, then check for sub-paths (e.g., /api/products/some-slug)
$matchedFile = null;
$pathExtra = '';

// Sort routes by length descending so longer prefixes match first
$sortedRoutes = $routes;
uksort($sortedRoutes, fn(string $a, string $b) => strlen($b) - strlen($a));

foreach ($sortedRoutes as $route => $file) {
    if ($path === $route || str_starts_with($path, $route . '/')) {
        $matchedFile = $file;
        $pathExtra = ($path === $route) ? '' : substr($path, strlen($route) + 1);
        break;
    }
}

if ($matchedFile === null) {
    error_response('Endpoint not found', 404);
}

// Make extra path segment available to handlers (e.g., product slug)
$_SERVER['PATH_EXTRA'] = $pathExtra;

require $matchedFile;
