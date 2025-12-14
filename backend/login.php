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

$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");


if (!$email || !$password){
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Email and password are required"]);
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

// Fetch user by email
if ($stmt = $conn->prepare("SELECT userID, userName, password FROM users WHERE email = ?")) {
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    $stmt->bind_result($id, $username, $hashedPassword);
    $stmt->fetch();

    // check password
    if (password_verify($password, $hashedPassword)) {
        // Password is correct
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "data" => [
                "id" => $id,
                "username" => $username,
                "email" => $email
            ]
        ]);
    } else {
        // Invalid password
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }

    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error"]);
}


?>