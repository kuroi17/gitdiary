<?php

// Set response type to JSON
header("Content-Type: application/json");

// Allow access from any domain (CORS)
header("Access-Control-Allow-Origin: *");

// Allow GET and OPTIONS requests
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Allow Content-Type header
header("Access-Control-Allow-Headers: Content-Type");

// Import / connect to your database
require "database.php";


// --------------------------------------------------------------
// CHECK IF A SINGLE ENTRY IS REQUESTED (via GET parameter "id")
// --------------------------------------------------------------
if (isset($_GET['id'])) {

    // Convert the id to an integer to avoid SQL injection
    $entryId = intval($_GET['id']);

    // SQL query to select a specific entry
    $sqlQuery = "SELECT * FROM entries WHERE entryNumber = ?";

    // Prepare the SQL statement to safely use variables
    $stmt = $conn->prepare($sqlQuery);

    // Bind the ID to the query (the "i" means integer)
    $stmt->bind_param("i", $entryId);

    // Execute the prepared statement
    $stmt->execute();

    // Get the result of the query
    $result = $stmt->get_result();

    // Check if an entry exists with that ID
    if ($result->num_rows > 0) {
        // Fetch that single entry as an associative array
        $entry = $result->fetch_assoc();

        // Return it as JSON
        echo json_encode($entry);
    } else {
        // Return null if no entry exists with that ID
        echo json_encode(null);
    }

    // Close the prepared statement
    $stmt->close();

} else {

    // --------------------------------------------------------------
    // NO ID PROVIDED → FETCH ALL ENTRIES FROM THE DATABASE
    // --------------------------------------------------------------

    // SQL query to fetch all entries sorted by newest first
    $sqlQuery = "SELECT * FROM entries ORDER BY createdAt DESC";

    // Run query normally (no parameters needed)
    $result = $conn->query($sqlQuery);

    // Create an empty array to hold all entries
    $entryContainer = [];

    // Check if the table contains rows
    if ($result->num_rows > 0) {
        // Loop through all rows and store them in the array
        while($row = $result->fetch_assoc()) {
            $entryContainer[] = $row;
        }
    }

    // Return all entries as JSON
    echo json_encode($entryContainer);
}

// Close database connection
$conn->close();

?>
