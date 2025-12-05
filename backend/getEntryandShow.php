<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require "database.php";

// Handle GET request with ID parameter
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sqlQuery = "SELECT * FROM entries WHERE id = ?";
    $stmt = $conn->prepare($sqlQuery);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "id" => $row["id"],
            "title" => $row["EntryTitle"],
            "content" => $row["EntryContent"],
            "date" => $row["EntryDate"],
            "image" => isset($row["EntryImage"]) ? $row["EntryImage"] : null
        ]);
    } else {
        echo json_encode(["error" => "Entry not found"]);
    }
    $stmt->close();
    $conn->close();
    exit; // ADD THIS - prevents execution of code below
}

// Return all entries
$sqlQuery = "SELECT * FROM entries ORDER BY EntryDate DESC";
$result = $conn->query($sqlQuery);
$entryContainer = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $entryContainer[] = [
            "id" => $row["id"],
            "title" => $row["EntryTitle"],
            "content" => $row["EntryContent"],
            "date" => $row["EntryDate"],
            "image" => isset($row["EntryImage"]) ? $row["EntryImage"] : null
        ];
    }
}

echo json_encode($entryContainer);
$conn->close();
?>