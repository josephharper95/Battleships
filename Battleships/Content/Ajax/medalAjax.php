<?php

/**
*
* Current Version: 0.1
*
* V0.1      Dave    16/01/17    initial creation
* V0.11     Nick    17/01/17    bug fix
* V0.12     Dave    19/01/17    fixed number of wins medals
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 

if (Input::itemExists("action")) { // If action Input exists

    $user = new User();
    
    $userId = Session::get("userID");
    $action = Input::post("action");
    

    switch ($action) { // Based on the action input, perform one set of tasks or another
        case "checkMedalConditions":
            $winner = Input::post("winner");
            $difficulty = Input::post("difficulty");
            $boardSize = Input::post("boardSize");
            $accuracy = Input::post("accuracy");
            $numberOfHits = Input::post("numberOfHits");
            checkMedalConditions();
            break;
        case "unlockMedal":
            $medalId = Input::post("medalId");
            unlockMedal($medalId, $userId);
            break;
    }

}

/**
 * Function unlocks the medal by its medal ID for the current logged in user 
 * 
 * @param int $medalID
 */
function unlockMedal($medalId) {
    global $userId, $user;

    if (isset($userId) && isset($medalId)) {

        $medals = $user->getMedalsByUserId($userId);
        $found = false;

        foreach ($medals as $medal) {

            if ($medal->medalID == $medalId) {

                $found = true;
            }
        }

        if (!$found) {

            $user->unlockMedal($userId, $medalId);
        }
    }
}

/**
 * Method checks to see whether a user meets specified criteria to lock a medal, if they do, calls the unlock method
 */
function checkMedalConditions(){
    global $userId, $user, $winner, $difficulty, $boardSize, $numberOfHits, $accuracy;

    if (isset($userId) && isset($winner) && isset($difficulty)) {
        //Check medals for winning a game
        if($winner == "player"){ // checks criteria for difficulty medals
            //Check medals for difficulty
            switch($difficulty){
                case "easy":
                    unlockMedal(1);
                    break;

                case "medium":
                    unlockMedal(2);
                    break;

                case "hard":
                    unlockMedal(3);
                break;

                case "multiplayer":
                    unlockMedal(20);
                break;
            }
            //Check medals for board size
            switch($boardSize){
                case 10:
                    unlockMedal(4);
                    break;

                case 15:
                    unlockMedal(5);
                    break;

                case 20:
                    unlockMedal(6);
                    break;
            }

            //Check total number of games won
            $numberOfWins = $user->getWinsByUserID($userId);
            switch($numberOfWins->wins){
                case 10:
                    unlockMedal(7);
                    break;
                case 50:
                    unlockMedal(8);
                    break;
                case 100:
                    unlockMedal(9);
                    break;
            }

            //Check accuracy
            if($accuracy >= 80){
                unlockMedal(10);
            }

            //Check number of hits
            if($numberOfHits == 0){
                unlockMedal(12);
            }
        }
     }
}

?>