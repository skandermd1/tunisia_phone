<?php

declare(strict_types=1);

/**
 * Send a JSON success response and exit.
 */
function json_response(mixed $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Send a JSON error response and exit.
 */
function error_response(string $msg, int $code = 400): never
{
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error'   => $msg,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Read JSON body from the request.
 */
function get_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);

    if (!is_array($data)) {
        return [];
    }

    return $data;
}
