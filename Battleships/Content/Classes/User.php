<?php

/**
*
* Last Modified By: Joe Harper
* Current Version: 0.1
*
* V0.1      Joe    21/10/16    initial creation
* V0.11     Joe    26/10/16    altered user statistics insert (now inserts a line per difficulty)
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
        $sql = "INSERT INTO userstatistics (userID, difficultyID, score, wins, gamesPlayed, 
                                            totalShotsFired, totalShotsHit, totalHitsReceived, totalPlayingTime)
				VALUES (?, '1', '0', '0', '0', '0', '0', '0', '0'),
				       (?, '2', '0', '0', '0', '0', '0', '0', '0'),
				       (?, '3', '0', '0', '0', '0', '0', '0', '0')";
        $values = array($userID, $userID, $userID);

        $this->db->query($sql, $values);
	}

    // Function adds 1 to the number of wins of the player with the specified difficulty
    function incrementWins($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET wins = wins + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of games played of the player with the specified difficulty
    function incrementGamesPlayed($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET gamesPlayed = gamesPlayed + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots fired of the player with the specified difficulty
    function incrementTotalShotsFired($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET totalShotsFired = totalShotsFired + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots fired and hit of the player with the specified difficulty
    function incrementTotalShotsHit($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET totalShotsHit = totalShotsHit + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots received of the player with the specified difficulty
    function incrementTotalHitsReceived($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET totalHitsReceived = totalHitsReceived + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds specified playing time to the previous playing time of the player
    function updateTotalPlayingTime($userID, $difficulty, $gameTime)
	{
		$sql = "UPDATE userstatistics
				SET totalPlayingTime = totalPlayingTime + ?
                WHERE userID = ? AND difficultyID = ?";
        $values = array($gameTime, $userID, $difficulty);

        $this->db->query($sql, $values);
    }
}

?>