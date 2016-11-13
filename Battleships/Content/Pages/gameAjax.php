<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/11/16    initial creation
* V0.11     Nick    01/11/16    added total playing time
* V0.12     Nick    13/11/16    added increment games played
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
        case "incrementGamesPlayed":
            incrementGamesPlayed();
            break;
        case "recordWin":
            recordWin();
            break;
        case "recordShots":
            $totalHits = Input::post("totalHits");
            $totalShots = Input::post("totalShots");
            $totalHitsReceived = Input::post("totalHitsReceived");
            $playingTime = Input::post("playingTime");

            recordShots($totalHits, $totalShots, $totalHitsReceived, $playingTime);
            break;
    }

}

function incrementGamesPlayed() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementGamesPlayed($userId, $difficultyId);
    }
}

function recordWin() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementWins($userId, $difficultyId);
    }
}

function recordShots($totalHits, $totalShots, $totalHitsReceived, $playingTime){
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementTotalShotsHit($userId, $difficultyId, $totalHits);
        $user->incrementTotalHitsReceived($userId, $difficultyId, $totalHitsReceived);
        $user->incrementTotalShotsFired($userId, $difficultyId, $totalShots);
        $user->updateTotalPlayingTime($userId, $difficultyId, $playingTime);
    }
}

?>