<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.13
*
* V0.1      Joe     21/10/16    initial creation
* V0.11     Joe     26/10/16    altered user statistics insert (now inserts a line per difficulty)
* V0.12     Joe     30/10/16    added queries to retrieve user statistics
* V0.13     Nick    01/11/16    updated queries to allow number of shots to be placed, added regions
* V0.14     Joe     14/11/16    added query to update score
* V0.15     Joe     14/11/16    updated new user query to reflect addition of multiplayer statistics
* V0.16     Joe     14/11/16    updated queries to reflect addition of new "incompleteGames" column
*
**/

class User {

    public $db;
    
    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    //Function to execute a query checking for a user in the table with the entered userID and hashed password
    function checkForUserAndPassword($userID, $hashedPassword) { 
        $sql = "SELECT userID, password
                FROM users
                WHERE userID = ? && password = ?
                LIMIT 1";
        $values = array($userID, $hashedPassword);

        $this->db->query($sql, $values);
    }

    //Function to insert new user into database
    function insertNewUser($userID, $hashedPassword, $firstName, $lastName) {
        $sql = "INSERT INTO users (userID, password, firstName, lastName)
                VALUES (?, ?, ?, ?)";
        $values = array($userID, $hashedPassword, $firstName, $lastName);

        $this->db->query($sql, $values);

        // User statistics setup
        $sql = "INSERT INTO userstatistics (userID, difficultyID, score, wins, gamesPlayed, incompleteGames,
                                            totalShotsFired, totalShotsHit, totalHitsReceived, totalPlayingTime)
                VALUES  (?, '1', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '2', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '3', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '4', '0', '0', '0', '0', '0', '0', '0', '0')";
        $values = array($userID, $userID, $userID, $userID);

        $this->db->query($sql, $values);
    }

#region GETTERS

    //Function to execute a query, getting the user details from the database with the entered userID
   	function getUserByID($userID) {
        $sql = "SELECT userID, firstName, lastName
				FROM users 
				WHERE userID = ?
				LIMIT 1";
        $values = array($userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    function getDifficulties() {
        $sql = "SELECT difficultyID as 'id', difficulty as 'name'
				FROM difficulties";
        $values = array();
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
    }

    //Function to execute a query, getting the user statistics from the database with the entered userID
   	function getUserStatisticsByUserIDAndDifficulty($userID, $difficulty) {
        $sql = "SELECT score, wins, gamesPlayed, incompleteGames, totalShotsFired, totalShotsHit, totalHitsReceived, totalPlayingTime
				FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
				WHERE d.difficultyID = ? AND us.userID = ?
				LIMIT 1";
        $values = array($difficulty, $userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and scores by difficulty
   	function getTopTenUsersScoresByDifficulty($difficulty) {
        $sql = "SELECT u.userID, firstName, lastName, score
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficultyID = ?
                ORDER BY score desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and wins by difficulty
   	function getTopTenUsersWinsByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, wins
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY wins desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and games played by difficulty
   	function getTopTenUsersGamesPlayedByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, gamesPlayed
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY gamesPlayed desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and total shots fired by difficulty
   	function getTopTenUsersTotalShotsFiredByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, totalShotsFired
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY totalShotsFired desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and total shots hit by difficulty
   	function getTopTenUsersTotalShotsHitByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, totalShotsHit
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY totalShotsHit desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and total hits received by difficulty
   	function getTopTenUsersTotalHitsReceivedByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, totalHitsReceived
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY totalHitsReceived desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and total playing time by difficulty
   	function getTopTenUsersTotalPlayingTimeByDifficulty($difficulty)
	{
        $sql = "SELECT u.userID, firstName, lastName, totalPlayingTime
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficulty = ?
                ORDER BY totalPlayingTime desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

#endregion

#region SETTERS

    // Function updates the score of the player with the specified difficulty
    function updateScore($userID, $difficulty, $gameScore)
	{
		$sql = "UPDATE userstatistics
				SET score = score + ?
                WHERE userID = ? AND difficultyID = ?";
        $values = array($gameScore, $userID, $difficulty);

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

    // Function adds 1 to the number of incomplete games of the player with the specified difficulty
    function incrementIncompleteGames($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET incompleteGames = incompleteGames + 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function takes 1 from the number of incomplete games of the player with the specified difficulty
    function decrementIncompleteGames($userID, $difficulty)
	{
		$sql = "UPDATE userstatistics
				SET incompleteGames = incompleteGames - 1
                WHERE userID = ? AND difficultyID = ?";
        $values = array($userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots fired of the player with the specified difficulty
    function incrementTotalShotsFired($userID, $difficulty, $shots)
	{
		$sql = "UPDATE userstatistics
				SET totalShotsFired = totalShotsFired + ?
                WHERE userID = ? AND difficultyID = ?";
        $values = array($shots, $userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots fired and hit of the player with the specified difficulty
    function incrementTotalShotsHit($userID, $difficulty, $shots)
	{
		$sql = "UPDATE userstatistics
				SET totalShotsHit = totalShotsHit + ?
                WHERE userID = ? AND difficultyID = ?";
        $values = array($shots, $userID, $difficulty);

        $this->db->query($sql, $values);
    }

    // Function adds 1 to the number of total shots received of the player with the specified difficulty
    function incrementTotalHitsReceived($userID, $difficulty, $shots)
	{
		$sql = "UPDATE userstatistics
				SET totalHitsReceived = totalHitsReceived + ?
                WHERE userID = ? AND difficultyID = ?";
        $values = array($shots, $userID, $difficulty);

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

#endregion

}

?>