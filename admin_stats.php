<?php
// api/admin_stats.php
include_once 'config.php';

$stats = [
    "total_revenue" => 0,
    "total_tickets_sold" => 0,
    "total_events" => 0,
    "recent_bookings" => []
];

try {
    // 1. Get total events
    $stmt = $conn->query("SELECT COUNT(*) as count FROM events");
    $stats["total_events"] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // 2. Get total revenue and tickets sold
    $stmt = $conn->query("SELECT SUM(total_amount) as revenue, SUM(number_of_tickets) as tickets FROM bookings");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats["total_revenue"] = $row['revenue'] ?? 0;
    $stats["total_tickets_sold"] = $row['tickets'] ?? 0;

    // 3. Get recent bookings with user and event details
    $query = "SELECT b.id as booking_id, b.number_of_tickets, b.total_amount, b.booking_date,
                     u.name as user_name, u.email as user_email,
                     e.name as event_name 
              FROM bookings b
              JOIN users u ON b.user_id = u.id
              JOIN events e ON b.event_id = e.id
              ORDER BY b.booking_date DESC LIMIT 10";
    $stmt = $conn->query($query);
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($stats["recent_bookings"], $row);
    }

    http_response_code(200);
    echo json_encode(["status" => "success", "data" => $stats]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
