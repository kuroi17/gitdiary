<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://zany-chainsaw-979qw6xj947gh7qxp-5503.app.github.dev");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

require "database.php"; // include DB connection

// get json from request body
$jsonData = file_get_contents('php://input');

// decode json to associative array
$entryData = json_decode($jsonData, true);

// Validate data (FIX: was checking wrong field)
if(!isset($entryData['title']) || !isset($entryData['content'])){
    http_response_code(400);
    echo json_encode(['success' => false, 
    'message' => 'Title and content are required.']);
    exit;
}

$title = $entryData["title"];
$content = $entryData["content"];
$date = $entryData["date"] ?? date('Y-m-d H:i:s');
$image = $entryData["image"] ?? null;

// insert entry into database
$stmt = $conn->prepare("INSERT INTO entries (entryTitle, entryContent, createdAt) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $title, $content, $date);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Entry saved.",
        "data" => $entryData
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>