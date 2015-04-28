<?php

class Database {
    
    private $connection;
    private $host;
    private $username;
    private $password;
    private $database;
    public $error;
    
    public function __construct($host, $username, $password, $database){
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
      
        $this->connection = new mysqli($host, $username, $password);
        
        if($this->connection->connect_error){
            die("<p>Error: " . $this->connection->connect_error . "</p>");
        }
        
        $exists = $this->connection->select_db($database);
        
        if(!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database");
            
            if($query) {
                echo "<p>Successfully created database:" . $database . "</p>";
            }
        }else{
            echo "<p>Database already exists.</p>";
        }
    } 
        
    public function openConnection() {
        //this is how the connection will open
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
   
        if ($this->connection->connect_error) {
            die("<p>Error: " . $this->connection->connect_error . "</p>");
            //if the connection does not work we have this code ^\\
            //to leave the website ^^\\
        }
    }
    
    public function closeConnection() {
        //this code will close the connection
        if(isset($this->connection)) {
            $this->connection->close();
        }
    }
    
    public function query ($string) {
        $this->openConnection();
        
        $query = $this->connection->query($string);
        
        if(!$query){
            $this->error = $this->connection->error;
        }
        
        $this->closeConnection();
        
        return $query;
    }
}
