<?php



function apply_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // Allow Vercel deployments and localhost
    if ($origin && (
        str_ends_with($origin, '.vercel.app') ||
        str_starts_with($origin, 'http://localhost')
    )) {
        header("Access-Control-Allow-Origin: {$origin}");
    } else {
        // Fallback: allow all for API access
        header("Access-Control-Allow-Origin: *");
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
    header('Content-Type: application/json; charset=utf-8');
}
