<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    28/11/16    initial creation statistic
* V0.11     Nick    28/11/16    difficulty is now an ID as it should have been
* V0.12     Nick    02/12/17    added decrement incomplete games
*
**/

require_once("../Classes/setup.php");

$user; 
$userId; 
$difficultyId;

if (Input::itemExists("action")) { // If an action exists

    $user = new User();
    
    $userId = Session::get("userID");

    $difficulties = $user->getDifficulties();
    $difficultyId = $difficulties[3]->id;

    $action = Input::post("action");

    switch ($action) { // Based on the input action, a chunk of methods is chosen in the switch statement
        case "incrementIncompleteGames":
            incrementIncompleteGames();
            break;
        case "decrementIncompleteGames":
            decrementIncompleteGames();
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
 * Method to increment the number of games played for the current user in multiplayer
 */
function incrementGamesPlayed() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) { // Makes calls to user class methods

        $user->incrementGamesPlayed($userId, $difficultyId);
    }
}

/**
 * Method to increment the number of incomplete games for the current user in multiplayer
 */
function incrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) { // Makes calls to user class methods

        $user->incrementIncompleteGames($userId, $difficultyId);
    }
}

/**
 * Method to decrement the number of games played for the current user in multiplayer
 */
function decrementIncompleteGames() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) { // Makes calls to user class methods

        $user->decrementIncompleteGames($userId, $difficultyId);
    }
}

/**
 * Method to increment the number of wins for the current user in multiplayer
 */
function recordWin() {
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) { // Makes calls to user class methods

        $user->incrementWins($userId, $difficultyId);
    }
}

/**
 * Method to finalise statistics upon game completion
 *
 * @param int $totalHits
 * @param int $totalShots
 * @param int $totalHitsReceived
 * @param int $playingTime
 * @param int $gameScore
 */
function recordShots($totalHits, $totalShots, $totalHitsReceived, $playingTime, $gameScore){
    global $userId, $user, $difficultyId;

    if (isset($userId) && isset($difficultyId)) { // Makes calls to user class methods

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