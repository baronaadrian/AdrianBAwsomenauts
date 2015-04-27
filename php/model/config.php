<?php
require_once(__DIR__. "/Database.php");
session_start();
//prevents hackers from hacking into a session without logging in
session_regenerate_id(true);

$path = '/AdrianBAwsomenauts/php/';

$host = "localhost";
$username = "root";
$password = "root";
$database = "awsomenauts_db";

if(!isset($_SESSION["connection"])){
    echo "sessionstart";
    $connection = new Database($host, $username, $password, $database);
    $_SESSION["connection"] = $connection;
    }