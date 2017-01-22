<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/11/16    initial creation
* V0.11     Nick    01/11/16    added total playing time
* V0.12     Nick    13/11/16    added increment games played
* V0.13     Joe     14/11/16    added update score
* V0.14     Joe     14/11/16    altered call names + added methods to reflect addition of incomplete games statistic
* V0.15     Joe     01/12/16    added updateHighScore ajax to recordShots method
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 
$difficultyId;

if (Input::itemExists("action")) { // If the input "action" exists

    $user = new User();
    
    $userId = Session::get("userID");
    $difficultyId = Session::get("difficultyID");

    $action = Input::post("action");

    switch ($action) { // Depending on the action input, call one of the following case blocks
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

/**
 * Increments the number of games played by 1 for the current user logged in
 */
function incrementGamesPlayed() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementGamesPlayed($userId, $difficultyId); // Call from User Class
    }
}

/**
 * Increments the number of incomplete games played by 1 for the current user logged in
 */
function incrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementIncompleteGames($userId, $difficultyId); // Call from User Class
    }
}

/**
 * Decrements the number of incomplete games played by 1 for the current user logged in
 */
function decrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->decrementIncompleteGames($userId, $difficultyId); // Call from User Class
    }
}

/**
 * Records a win for the current user by incrementing the number of wins
 */
function recordWin() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) {

        $user->incrementWins($userId, $difficultyId); // Call from User Class
    }
}

/**
 * Method records key information based on the end game results
 * 
 * @param int $totalHits, 
 * @param int $totalShots
 * @param int $totalHitsReceived
 * @param int $playingTime
 * @param int $gameScore
 */
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
        $user->updateHighScore($userId, $difficultyId, $gameScore);
    }
}

?>