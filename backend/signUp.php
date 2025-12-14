<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
  http_response_code(200);
  exit;
}


if ($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

require "database.php"; // include DB connection

// Get the raw POST data
$input = json_decode(file_get_contents("php://input"), true);

$username = trim($input["username"] ?? "");
$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

if (!$username || !$email || !$password){
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "All fields are required"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Invalid email format"
  ]);
  exit;
}


// check if username or email already exists
if ($stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?")) {
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Username or email already exists"]);
        exit;
    }
    $stmt->close();
}


// Check if username or email already exists
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hashedPassword);




if ($stmt->execute()) {
    // json_encode means converting PHP array to JSON format again
    echo json_encode([
        "success" => true,
        "message" => "Sign up successful.",
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