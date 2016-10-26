<?php

/**
*
* Last Modified By: Joe Harper
* Current Version: 0.1
*
* V0.1      Joe    21/10/16    initial creation
*
**/

class User{     


    public $db;
    
    public function __construct()
    {
        $this->db = Database::getInstance();
    }

     //Function to execute a query checking for a user in the table with the entered userID and hashed password
     function checkForUserAndPassword($userID, $hashedPassword)
     { 
        $sql = "SELECT userID, password
                FROM users
			    WHERE userID = ? && password = ?
		 	    LIMIT 1";
        $values = array($userID, $hashedPassword);
       
        $this->db->query($sql, $values);
    }

    //Function to execute a query, getting the user details from the database with the entered userID
   	function getUserByID($userID)
	{
        $sql = "SELECT userID, firstName, lastName
				FROM users 
				WHERE userID = ?
				LIMIT 1";
        $values = array($userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to insert new user into database
    function insertNewUser($userID, $hashedPassword, $firstName, $lastName)
	{
		$sql = "INSERT INTO users (userID, password, firstName, lastName)
				VALUES (?, ?, ?, ?)";
        $values = array($userID, $hashedPassword, $firstName, $lastName);

        $this->db->query($sql, $values);

        // User statistics setup
        $sql = "INSERT INTO userstatistics (userID, difficultyID, score, wins, gamesPlayed, totalShotsFired, totalShotsHit, totalPlayingTime)
				VALUES (?, '1', '0', '0', '0', '0', '0', '0'),
				       (?, '2', '0', '0', '0', '0', '0', '0'),
				       (?, '3', '0', '0', '0', '0', '0', '0')";
        $values = array($userID, $userID, $userID);

        $this->db->query($sql, $values);
	}
}

?>