<?php

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = 'sql108.infinityfree.com';
            $dbname = 'if0_41451296_shop';
            $username = 'if0_41451296';
            $password = 'UulJkhjSCg9k';

            try {
                self::$instance = new PDO(
                    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                    $username,
                    $password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Database connection failed']);
                exit;
            }
        }

        return self::$instance;
    }
}

// Compatibility function used by API handlers
function get_db_connection(): PDO {
    return Database::getConnection();
}
