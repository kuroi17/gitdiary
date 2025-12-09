<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
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



// Get form data
$title = $_POST["title"] ?? null;
$content = $_POST["content"] ?? null;
$date = $_POST["date"] ?? date('Y-m-d H:i:s', time());

if (!$title || !$content){
    http_response_code(400);
    echo json_encode(["success" => false, 
    "message" => "Title and content are required"]);
    exit;
}
    // handle file upload
    $mediaPath = null;
    if (isset($_FILES['media']) && $_FILES['media']['error'] === UPLOAD_ERR_OK) {
        $uploadDirectory = __DIR__ . "/uploads/";
        
        // create upload directory if not exists
        if (!is_dir($uploadDirectory)){
            mkdir($uploadDirectory, 0755, true);
        }

        $fileExtension = pathinfo($_FILES['media']['name'], PATHINFO_EXTENSION);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'];

        // validate file type
        if (!in_array(strtolower($fileExtension), $allowedExtensions)){
            http_response_code(400);
            echo json_encode(["success" => false, 
            "message" => "Invalid file type"]);
            exit;
        }
        // validate file size (max 10MB)
         if ($_FILES['media']['size'] > 10 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File too large. Max 10MB.']);
        exit;
    }

        // generate unique file name
        $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
        $destination = $uploadDirectory . $fileName;

        // this checks and moves the uploaded file to the destination
        if (move_uploaded_file($_FILES['media']['tmp_name'], $destination)){
            $mediaPath = "backend/uploads/" . $fileName; // relative path to access the file
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, 
            "message" => "Failed to upload file"]);
            exit;
        }
}

// Insert entry into database
$stmt = $conn->prepare("INSERT INTO entries (entryTitle, entryContent, createdAt, entryMedia) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $title, $content, $date, $mediaPath);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Entry saved.",
        "mediaPath" => $mediaPath
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
