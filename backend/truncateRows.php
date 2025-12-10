  <?php 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

require "database.php";

// Delete all uploaded files first
$uploadDirectory = __DIR__ . "/uploads/";
if (is_dir($uploadDirectory)) {
    $files = glob($uploadDirectory . '*'); // Get all files
    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file); // Delete each file
        }
    }
}

// Truncate the entries table (removes all rows and resets auto-increment)
$sql = "TRUNCATE TABLE `entries`";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "success" => true,
        "message" => "All entries deleted successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $conn->error
    ]);
}

$conn->close();
?>