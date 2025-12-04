<?php 

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");

require"database.php";

$sqlQuery = "Select * from entries order by createdat DESC";
// The $conn->query() method executes a single SQL query against a database connection 
$result = $conn->query(($sqlQuery));
$entryContainer = [];

// nums_rows is used to retrieve the number of rows in a result set
//fetch_assoc() fetches a result row as an associative array

if ($result-> num_rows > 0){
  // while it is true that there are rows to fetch
while($row = $result-> fetch_assoc()){
$entryContainer[] = $row;
}
}


echo json_encode($entryContainer);
$conn -> close();