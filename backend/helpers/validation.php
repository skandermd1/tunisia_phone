<?php

declare(strict_types=1);

/**
 * Validate that all required fields are present and non-empty in the data array.
 * Returns an array of missing field names (empty if all present).
 */
function validate_required(array $fields, array $data): array
{
    $missing = [];

    foreach ($fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $missing[] = $field;
        }
    }

    return $missing;
}

/**
 * Validate a Tunisian phone number (8 digits, optionally prefixed with +216 or 216).
 */
function validate_phone(string $phone): bool
{
    // Strip spaces and dashes
    $phone = preg_replace('/[\s\-]/', '', $phone);

    // Remove optional country code prefix
    if (str_starts_with($phone, '+216')) {
        $phone = substr($phone, 4);
    } elseif (str_starts_with($phone, '216')) {
        $phone = substr($phone, 3);
    }

    // Must be exactly 8 digits
    return (bool) preg_match('/^\d{8}$/', $phone);
}
