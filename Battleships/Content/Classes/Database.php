<!--
*
* Last Modified By: Nick Holdsworth
* Last Modified On: 03/10/16
* Current Version: 0.21
*
* V0.1      Dave    01/10/16    initial creation
* V0.2      Joe     02/10/16    added user operations
* V0.21     Nick    03/10/16    update user operations to include first name / last name
*
-->

<?php
//singleton pattern 
class Database
{
    private static $instance = null;
    private $pdo,
             $query,
             $results,
             $rowCount;
   
   //Private constructor to stop more instances being created         
   private function __construct()
   {
       try 
       {
        //    $this->pdo = new PDO("mysql:host=localhost;dbname=battleships;", "root", "");
           $this->pdo = new PDO("mysql:host=localhost;dbname=battleships;", "root", "root"); // nick
       } 
       catch(PDOException $e)
       {
           die("Error connecting to database");
       }
   }
   //Function to return the instance, if one doesn't exit, create one. This ensures only one instance can exist.
   public static function getInstance()
   {
       if(!isset(self::$instance))
       {
           self::$instance = new Database();
       }
       return self::$instance;
   }

   //Function to return the id of the last inserted row.
   public function lastInsertedId()
   {
       $id =  $this->pdo->lastInsertId();
       return $id;
   }
   
   //Function to prepare and execute sql queries. Preparing the querys helps to prevent SQL injection
   public function query($sql, $values = array())
   {
        $this->query = $this->pdo->prepare($sql);//Sql statement sent to database with values replaced with (?);
        for($i=1;$i<=count($values);$i++)
        {
            $this->query->bindValue($i, $values[$i-1]);//loops through and binds the values to the ? in the sql statement
        }
        try
        {
            $this->query->execute();//Executes the query
        } 
        catch(Exception $e)
        {
            die("Error executing query");
        }
        $this->results = $this->query->fetchAll(PDO::FETCH_OBJ);//returns results as an object, with property names that correspond to column names.
        $this->rowCount = $this->query->rowCount();
        return $this;
   }
   //Function to return the results of the last query.
   public function getResults()
   {
       return $this->results;
   }

   //Function to return the row count of the last query.
   public function getRowCount()
   {
       return $this->rowCount;
   }        

   public function checkForUserAndPassword($userID, $hashedPassword)
   {
       $sql = "SELECT userID, password
               FROM users
			   WHERE userID = ? && password = ?
			   LIMIT 1";
       $values = array($userID, $hashedPassword);
       
       $this->query($sql, $values);
   }

   	function getUserByID($userID)
	{

        $sql = "SELECT userID, firstName, lastName
				FROM users 
				WHERE userID = ?
				LIMIT 1";
        $values = array($userID);
		
		$user = $this->query($sql, $values);

        return $user->results;
	}

    function insertNewUser($userID, $hashedPassword, $firstName, $lastName)
	{
		$sql = "INSERT INTO users (userID, password, firstName, lastName)
				VALUES (?, ?, ?, ?)";
        $values = array($userID, $hashedPassword, $firstName, $lastName);

        $this->query($sql, $values);

        // User statistics setup
        $sql = "INSERT INTO userstatistics (userID, score, wins, losses, gamesPlayed, totalShotsFired)
				VALUES (?, '0', '0', '0', '0', '0')";
        $values = array($userID);

        $this->query($sql, $values);
	}
}

?>