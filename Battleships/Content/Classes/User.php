<?php

/**
*
* Last Modified By: Joe Harper
* Current Version: 0.20
*
* V0.1      Joe     21/10/16    initial creation
* V0.11     Joe     26/10/16    altered user statistics insert (now inserts a line per difficulty)
* V0.12     Joe     30/10/16    added queries to retrieve user statistics
* V0.13     Nick    01/11/16    updated queries to allow number of shots to be placed, added regions
* V0.14     Joe     14/11/16    added query to update score
* V0.15     Joe     14/11/16    updated new user query to reflect addition of multiplayer statistics
* V0.16     Joe     14/11/16    updated queries to reflect addition of new "incompleteGames" column
* V0.17     Joe     01/12/16    updated methods + added method to reflect the addition of a new "highScore" column
* V0.18     Joe     01/12/16    added getMultiplayerDataByUserID method
* V0.19     Nick    03/12/16    added accuracy top 10, made it so stats must be above 0
* V0.20     Joe     16/01/17  added medal queries
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
    function insertNewUser($userID, $hashedPassword, $firstName, $lastName, $emailAddress) {
        $sql = "INSERT INTO users (userID, password, firstName, lastName, emailAddress)
                VALUES (?, ?, ?, ?, ?)";
        $values = array($userID, $hashedPassword, $firstName, $lastName, $emailAddress);

        $this->db->query($sql, $values);

        // User statistics setup
        $sql = "INSERT INTO userstatistics (userID, difficultyID, score, highScore, wins, gamesPlayed, incompleteGames,
                                            totalShotsFired, totalShotsHit, totalHitsReceived, totalPlayingTime)
                VALUES  (?, '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '2', '0', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '3', '0', '0', '0', '0', '0', '0', '0', '0', '0'),
                        (?, '4', '0', '0', '0', '0', '0', '0', '0', '0', '0')";
        $values = array($userID, $userID, $userID, $userID);

        $this->db->query($sql, $values);
    }

    //Function to unlock user medals by adding the userID and medalID into the link table
    function unlockMedal($userID, $medalID) {
        $sql = "INSERT INTO usermedals (userID, medalID)
                VALUES (?, ?)";
        $values = array($userID, $medalID);

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
        $sql = "SELECT score, highScore, wins, gamesPlayed, incompleteGames, totalShotsFired, totalShotsHit, totalHitsReceived, totalPlayingTime
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
                AND score > 0
                ORDER BY score desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the top ten users and high scores by difficulty
   	function getTopTenUsersHighScoresByDifficulty($difficulty) {
        $sql = "SELECT u.userID, firstName, lastName, highScore
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficultyID = ?
                AND highScore > 0
                ORDER BY highScore desc
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
                WHERE d.difficultyID = ?
                AND wins > 0
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
                WHERE d.difficultyID = ?
                AND gamesPlayed > 0
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
                WHERE d.difficultyID = ?
                AND totalShotsFired > 0
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
                WHERE d.difficultyID = ?
                AND totalShotsHit > 0
                ORDER BY totalShotsHit desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    function getTopTenUsersHitAccuracyByDifficulty($difficulty) {
        $sql = "SELECT u.userID, firstName, lastName, ((totalShotsHit / totalShotsFired) * 100) as 'accuracy'
                FROM userstatistics us
                    JOIN difficulties d
                        ON us.difficultyID = d.difficultyID
                    JOIN users u
                        ON u.userID = us.userID
                WHERE d.difficultyID = ?
                AND totalShotsHit > 0
                ORDER BY accuracy desc
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
                WHERE d.difficultyID = ?
                AND totalHitsReceived > 0
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
                WHERE d.difficultyID = ?
                AND totalPlayingTime > 0
                ORDER BY totalPlayingTime desc
                LIMIT 10";
        $values = array($difficulty);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the users multiplayer statistics displayed on their room
   	function getMultiplayerDataByUserID($userID) {
        $sql = "SELECT highScore, gamesPlayed, incompleteGames
				FROM userstatistics us
				WHERE us.difficultyID = 4 AND us.userID = ?
				LIMIT 1";
        $values = array($userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the users medals
   	function getMedalsByUserID($userID) {
        $sql = "SELECT m.medalID, m.medalName, m.medalCategory
				FROM usermedals um
                    JOIN medals m
                        ON um.medalID = m.medalID
				WHERE um.userID = ?";
        $values = array($userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting the users total number of wins
   	function getWinsByUserID($userID) {
        $sql = "SELECT SUM(wins)
				FROM userstatistics us
				WHERE us.userID = ?";
        $values = array($userID);
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting all the medals
   	function getAllMedals() {
        $sql = "SELECT m.medalID, m.medalName, m.medalCategory
				FROM medals m";
        $values = array();
		
		$this->db->query($sql, $values);

        return $this->db->getResults();
	}

    //Function to execute a query, getting all the medals
   	function getAllMedalsByUserID($userID) {
        $sql = "SELECT m.medalName, m.medalCategory, CASE um.userID 
										WHEN ? 
                                        THEN TRUE 
                                        ELSE FALSE 
                                     END AS 'isUnlocked' 
                FROM usermedals um 
	                RIGHT JOIN medals m 
    	                ON um.medalID = m.medalID 
                WHERE um.userID = ? || um.userID is NULL";
        $values = array($userID, $userID);
		
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

    // Function updates the score of the player with the specified difficulty
    function updateHighScore($userID, $difficulty, $gameScore)
	{
		$sql = "UPDATE userstatistics
				SET highScore = ?
                WHERE userID = ? AND difficultyID = ? AND ? > highScore";
        $values = array($gameScore, $userID, $difficulty, $gameScore);

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

    // Function sets new password for user with specified ID
    function updatePasswordByUserID($userID, $encryptedPassword)
	{
		$sql = "UPDATE users
				SET password = ?
                WHERE userID = ?";
        $values = array($encryptedPassword, $userID);

        $this->db->query($sql, $values);
    }

#endregion
    
    // Function inserts pending reset row into DB
    function insertPendingPasswordReset($userID, $resetNumber)
	{
		$sql = "INSERT INTO pendingpasswordresets (userID, resetNumber)
                VALUES (?, ?)";
        $values = array($userID, $resetNumber);

        $this->db->query($sql, $values);
    }

    // Function checks if pending password reset exists
    function checkForPendingPasswordReset($userID, $resetNumber)
	{
		$sql = "SELECT pendingPasswordResetID, userID, resetNumber
                FROM pendingpasswordresets
                WHERE userID = ? && resetNumber = ?";
        $values = array($userID, $resetNumber);

        $this->db->query($sql, $values);

        return $this->db->getResults();
    }

    // Function deletes pending reset row from DB
    function deletePendingPasswordReset($userID)
	{
		$sql = "DELETE FROM pendingpasswordresets
                WHERE userID = ?";
        $values = array($userID);

        $this->db->query($sql, $values);
    }

}

?>