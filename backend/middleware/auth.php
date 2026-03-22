<?php



require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/constants.php';

/**
 * Authenticate the request via Bearer token.
 * Returns the admin payload from the JWT or sends 401 and exits.
 */
function authenticate(): array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!str_starts_with($header, 'Bearer ')) {
        error_response('Authentication required', 401);
    }

    $token = substr($header, 7);
    $payload = jwt_decode($token, JWT_SECRET);

    if ($payload === null) {
        error_response('Invalid or expired token', 401);
    }

    return $payload;
}
