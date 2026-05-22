<?php
// api/user_bookings.php
include_once 'config.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id > 0) {
    try {
        $query = "SELECT b.id as booking_id, b.number_of_tickets, b.total_amount, b.booking_date,
                         e.name as event_name, e.date_time, e.venue 
                  FROM bookings b
                  JOIN events e ON b.event_id = e.id
                  WHERE b.user_id = :user_id
                  ORDER BY b.booking_date DESC";
                  
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        $bookings = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($bookings, $row);
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $bookings]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "User ID is missing."]);
}
?>
