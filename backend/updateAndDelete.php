<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to DB
$conn = new mysqli("localhost", "root", "", "gitdiary");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Read JSON data from fetch
$entryData = json_decode(file_get_contents("php://input"), true);

$action = null;
$id = null;
$title = null;
$content = null;

// Using plain if-statements instead of ternary operators
if (isset($entryData['action'])) {
    $action = $entryData['action'];
}

if (isset($entryData['id'])) {
    $id = $entryData['id'];
}

if (isset($entryData['title'])) {
    $title = $entryData['title'];
}

if (isset($entryData['content'])) {
    $content = $entryData['content'];
}

// Check for missing action or id
if (!$action || !$id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing action or id"
    ]);
    $conn->close();
    exit;
}

// ==================== DELETE ====================
if ($action === "delete") {
    $sqlDeleteRow = "DELETE FROM entries WHERE id = ?";
    $stmt = $conn->prepare($sqlDeleteRow);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Entry deleted successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $conn->error
        ]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// ==================== UPDATE ====================
if ($action === "update") {
    $sqlUpdateRow = "UPDATE entries SET EntryTitle = ?, EntryContent = ? WHERE id = ?";
    $stmt = $conn->prepare($sqlUpdateRow);
    $stmt->bind_param("ssi", $title, $content, $id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Entry updated successfully.",
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
    exit;
}

// ==================== INVALID ACTION ====================
echo json_encode([
    "success" => false,
    "message" => "Invalid action"
]);
$conn->close();
?>
