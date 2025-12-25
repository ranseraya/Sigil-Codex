<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "app" => "Sigil Codex API",
    "version" => "1.0.0",
    "status" => "running",
    "server_time" => date("Y-m-d H:i:s"),
    "message" => "Access denied. Please use valid endpoints.",
    "maintained_by" => "Sigil Codex Team"
]);
?>