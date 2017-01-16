<?php

/**
*
* Current Version: 0.1
*
* V0.1      Dave    16/01/17    initial creation
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 

if (Input::itemExists("action")) {

    $user = new User();
    
    $userId = Session::get("userID");
    $action = Input::post("action");
    $winner = Input::post("winner");
    $difficulty = Input::post("difficulty");
    $boardSize = Input::post("boardSize");

    switch ($action) {
        case "checkMedalConditions":
            checkMedalConditions();
            break;
        case "unlockMedal":
            $medalId = Input::post("medalId");
            unlockMedal($medalId, $userId);
            break;
    }

}

function unlockMedal($medalId) {
    global $userId, $user;

    if (isset($userId) && isset($medalId)) {

        $medals = $user->getMedalsByUserId($userId);
        $found = false;
        foreach($medals as $medal){
            if($medal->medalID == $medalId){
                $found = true;
            }
        }
        if(!$found){
            $user->unlockMedal($userId, $medalId);
        }
    }
}

function checkMedalConditions(){
    global $userId, $user, $winner, $difficulty, $boardSize;

    if (isset($userId) && isset($winner) && isset($difficulty)) {
        //Check medals for winning a game
        if($winner == "player"){
            //Check medals for difficulty
            switch($difficulty){
                case "easy":
                    this.unlockMedal(1);
                    break;
                case "medium":
                    this.unlockMedal(2);
                    break;
                case "hard":
                    this.unlockMedal(3);
                break;
                case 4:
                break;
            }
            //Check medals for board size
            switch($boardSize){
                case 10:
                    this.unlockMedal(4);
                    break;
                case 15:
                    this.unlockMedal(5);
                    break;
                case 20:
                    this.unlockMedal(6);
                    break;
            }
        }
     }
}

?>