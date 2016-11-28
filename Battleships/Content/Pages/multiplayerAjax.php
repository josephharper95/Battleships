<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    28/11/16    initial creation statistic
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 
$difficultyId;

if (Input::itemExists("action")) {

    $user = new User();
    
    $userId = Session::get("userID");
    $difficultyId = "multiplayer";

    $action = Input::post("action");

    switch ($action) {
        case "incrementIncompleteGames":
            incrementIncompleteGames();
            break;
        case "recordWin":
            recordWin();
            break;
        case "recordShots":
            $totalHits = Input::post("totalHits");
            $totalShots = Input::post("totalShots");
            $totalHitsReceived = Input::post("totalHitsReceived");
            $playingTime = Input::post("playingTime");
            $gameScore = Input::post("gameScore");

            recordShots($totalHits, $totalShots, $totalHitsReceived, $playingTime, $gameScore);
            break;
    }

}

function incrementGamesPlayed() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementGamesPlayed($userId, $difficultyId);
    }
}

function incrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementIncompleteGames($userId, $difficultyId);
    }
}

function decrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->decrementIncompleteGames($userId, $difficultyId);
    }
}

function recordWin() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementWins($userId, $difficultyId);
    }
}

function recordShots($totalHits, $totalShots, $totalHitsReceived, $playingTime, $gameScore){
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementTotalShotsHit($userId, $difficultyId, $totalHits);
        $user->incrementTotalHitsReceived($userId, $difficultyId, $totalHitsReceived);
        $user->incrementTotalShotsFired($userId, $difficultyId, $totalShots);
        $user->updateTotalPlayingTime($userId, $difficultyId, $playingTime);
        $user->updateScore($userId, $difficultyId, $gameScore);
        $user->incrementGamesPlayed($userId, $difficultyId);
        $user->decrementIncompleteGames($userId, $difficultyId);
    }
}

?>