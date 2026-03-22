<?php

declare(strict_types=1);

// Copy this file to database.php and fill in your credentials.

function get_db_connection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host = 'localhost';
        $port = 3306;
        $dbname = 'tunisia_phone';
        $username = 'your_db_username';
        $password = 'your_db_password';
        $charset = 'utf8mb4';

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $username, $password, $options);
    }

    return $pdo;
}
