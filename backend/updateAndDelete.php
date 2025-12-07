<?php

// --------------------------------------------------------------
// SET HEADERS (CORS + JSON RESPONSE)
// --------------------------------------------------------------

// Tell the browser that the response is JSON
header("Content-Type: application/json");

// Allow all domains to access this API
header("Access-Control-Allow-Origin: *");

// Allow these HTTP methods from the client
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");

// Allow the Content-Type header so JSON can be sent
header("Access-Control-Allow-Headers: Content-Type");

// --------------------------------------------------------------
// CONNECT TO DATABASE
// --------------------------------------------------------------
require "database.php";

// --------------------------------------------------------------
// READ JSON DATA SENT FROM FRONTEND (fetch body)
// --------------------------------------------------------------
$entryData = json_decode(file_get_contents("php://input"), true);

// --------------------------------------------------------------
// EXTRACT VARIABLES USING IF/ELSE (no ternary operators)
// --------------------------------------------------------------

// Action → "delete" or "update"
if (isset($entryData['action'])) {
    $action = $entryData['action'];
} else {
    $action = null;
}

// ID of the entry to delete or update
if (isset($entryData['id'])) {
    $id = $entryData['id'];
} else {
    $id = null;
}

// New title (only needed for updates)
if (isset($entryData['title'])) {
    $title = $entryData['title'];
} else {
    $title = null;
}

// New content (only needed for updates)
if (isset($entryData['content'])) {
    $content = $entryData['content'];
} else {
    $content = null;
}

// --------------------------------------------------------------
// VALIDATION: Ensure action AND id exist
// --------------------------------------------------------------
if (!$action || !$id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing action or id"
    ]);
    $conn->close();
    exit; // stop script
}

// --------------------------------------------------------------
// =============== DELETE AN ENTRY ===============================
// --------------------------------------------------------------
if ($action === "delete") {

    // Prepare DELETE SQL statement
    $sqlDeleteRow = "DELETE FROM entries WHERE entryNumber = ?";
    $stmt = $conn->prepare($sqlDeleteRow);

    // Bind ID as an integer
    $stmt->bind_param("i", $id);

    // Execute delete query
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

    // Close statement + connection and exit
    $stmt->close();
    $conn->close();
    exit;
}

// --------------------------------------------------------------
// =============== UPDATE AN ENTRY ===============================
// --------------------------------------------------------------
if ($action === "update") {

    // Prepare UPDATE SQL statement
    $sqlUpdateRow = "UPDATE entries SET entryTitle = ?, entryContent = ? WHERE entryNumber = ?";
    $stmt = $conn->prepare($sqlUpdateRow);

    // Bind title, content (strings), id (int)
    $stmt->bind_param("ssi", $title, $content, $id);

    // Execute update query
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Entry updated successfully.",
            "data" => $entryData // Return what was sent
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $conn->error
        ]);
    }

    // Close statement + connection and exit
    $stmt->close();
    $conn->close();
    exit;
}

// --------------------------------------------------------------
// INVALID ACTION (neither delete nor update)
// --------------------------------------------------------------
echo json_encode([
    "success" => false,
    "message" => "Invalid action"
]);

$conn->close();

?>
