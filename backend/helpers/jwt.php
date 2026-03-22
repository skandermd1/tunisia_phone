<?php



/**
 * Base64url encode (RFC 7515).
 */
function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64url decode.
 */
function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'), true) ?: '';
}

/**
 * Create a JWT token using HMAC-SHA256.
 */
function jwt_encode(array $payload, string $secret): string
{
    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT',
    ];

    $segments = [];
    $segments[] = base64url_encode(json_encode($header));
    $segments[] = base64url_encode(json_encode($payload));

    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, $secret, true);
    $segments[] = base64url_encode($signature);

    return implode('.', $segments);
}

/**
 * Decode and verify a JWT token. Returns the payload array or null on failure.
 */
function jwt_decode(string $token, string $secret): ?array
{
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return null;
    }

    [$headerB64, $payloadB64, $signatureB64] = $parts;

    // Verify signature
    $signingInput = "{$headerB64}.{$payloadB64}";
    $expectedSig = hash_hmac('sha256', $signingInput, $secret, true);
    $actualSig = base64url_decode($signatureB64);

    if (!hash_equals($expectedSig, $actualSig)) {
        return null;
    }

    $payload = json_decode(base64url_decode($payloadB64), true);

    if (!is_array($payload)) {
        return null;
    }

    // Check expiry
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}
