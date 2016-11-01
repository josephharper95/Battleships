<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/11/16    initial creation
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 
$difficultyId;

if (Input::itemExists("action")) {

    $user = new User();
    
    $userId = Session::get("userID");
    $difficultyId = Session::get("difficultyID");

    $action = Input::post("action");

    switch ($action) {
        case "recordWin":
            recordWin();
            break;
        case "recordShots":
            $totalHits = Input::post("totalHits");
            $totalShots = Input::post("totalShots");
            $totalHitsReceived = Input::post("totalHitsReceived");

            recordShots($totalHits, $totalShots, $totalHitsReceived);
            break;
    }

}

function recordWin() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementWins($userId, $difficultyId);
    }
}

function recordShots($totalHits, $totalShots, $totalHitsReceived){
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementTotalShotsHit($userId, $difficultyId, $totalHits);
        $user->incrementTotalHitsReceived($userId, $difficultyId, $totalHitsReceived);
        $user->incrementTotalShotsFired($userId, $difficultyId, $totalShots);
    }
}

?>