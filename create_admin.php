<?php
include_once 'api/config.php';

try {
    // Add column if not exists
    try {
        $conn->exec("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'");
        echo "Added 'role' column.\n";
    } catch(PDOException $e) {
        echo "Column 'role' might already exist. Proceeding...\n";
    }

    // Insert admin
    $name = "System Administrator";
    $email = "admin@university.edu";
    $password = password_hash("admin", PASSWORD_BCRYPT);
    $department = "Administration";
    $role = "admin";

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, department, role) VALUES (:name, :email, :password, :department, :role)");
    $stmt->execute(['name' => $name, 'email' => $email, 'password' => $password, 'department' => $department, 'role' => $role]);

    echo "Admin user created successfully.\n";
} catch(PDOException $e) {
    echo "Error inserting admin (might already exist): " . $e->getMessage() . "\n";
}
?>
