<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (for CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// Start the session
session_start();

// Check if session exists
if (isset($_SESSION)) {
    // Remove all session variables
    session_unset();
    // Destroy the session
    session_destroy();
    
    echo json_encode(["success" => true, "message" => "Logout successful"]);
} else {
    echo json_encode(["success" => false, "message" => "No active session found"]);
}
?>
