<?php
// api/events.php
include_once 'config.php';

$query = "SELECT * FROM events ORDER BY date_time ASC";
$stmt = $conn->prepare($query);
$stmt->execute();

$events_arr = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($events_arr, $row);
}

http_response_code(200);
echo json_encode(["status" => "success", "data" => $events_arr]);
?>
