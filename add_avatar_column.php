<?php
include_once 'api/config.php';

try {
    $conn->exec("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL");
    echo "Added 'avatar_url' column.\n";
} catch(PDOException $e) {
    echo "Column 'avatar_url' might already exist: " . $e->getMessage() . "\n";
}
?>
