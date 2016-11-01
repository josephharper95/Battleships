<?php

/**
*
*   Last Modified By: Nick Holdsworth
*   Current Version: 0.1
*
*   V0.1    Nick    30/10/16    initial creation
*   V0.11   Nick    01/11/16    added initial data from db
*   V0.12   Nick    01/11/16    added total playing time
*
*/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check the user is logged in by checking the session variable
if(!Session::get("userID")) {

    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

// include the header file if it has not been included before
require_once("header.php");

$user = new User();
$userId = Session::get("userID");

$difficulties = $user->getDifficulties();
$easy = $difficulties[0];
$medium = $difficulties[1];
$hard = $difficulties[2];

$playerEasy = $user->getUserStatisticsByUserIDAndDifficulty($userId, $easy->id)[0];
$playerMedium = $user->getUserStatisticsByUserIDAndDifficulty($userId, $medium->id)[0];
$playerHard = $user->getUserStatisticsByUserIDAndDifficulty($userId, $hard->id)[0];

function convertPlayingTime($seconds) {
    $hours = $seconds / 3600  % 24;
    $minutes = $seconds / 60  % 60;
    $seconds = $seconds % 60;

    $result = ($hours < 10 ? "0" . $hours : $hours) . " : " . ($minutes < 10 ? "0" . $minutes : $minutes) . " : " . ($seconds  < 10 ? "0" . $seconds : $seconds);

    return $result;
}

?>

<div id="pageStatistics" class="wideWidth">

    <h1>Statistics</h1>

    <h3>Player Statistics</h3>

    <table>
        <thead>
            <tr>
                <th></th>
                <th>
                    Easy
                </th>
                <th>
                    Medium
                </th>
                <th>
                    Hard
                </th>
            </tr>
        </thead>
    
        <tbody>
            <tr>
                <td>
                    Score
                </td>
                <td>
                    <?= $playerEasy->score; ?>
                </td>
                <td>
                    <?= $playerMedium->score; ?>
                </td>
                <td>
                    <?= $playerHard->score; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Wins
                </td>
                <td>
                    <?= $playerEasy->wins; ?>
                </td>
                <td>
                    <?= $playerMedium->wins; ?>
                </td>
                <td>
                    <?= $playerHard->wins; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Games Played
                </td>
                <td>
                    <?= $playerEasy->gamesPlayed; ?>
                </td>
                <td>
                    <?= $playerMedium->gamesPlayed; ?>
                </td>
                <td>
                    <?= $playerHard->gamesPlayed; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Total Shots Fired
                </td>
                <td>
                    <?= $playerEasy->totalShotsFired; ?>
                </td>
                <td>
                    <?= $playerMedium->totalShotsFired; ?>
                </td>
                <td>
                    <?= $playerHard->totalShotsFired; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Total Shots Hit
                </td>
                <td>
                    <?= $playerEasy->totalShotsHit; ?>
                </td>
                <td>
                    <?= $playerMedium->totalShotsHit; ?>
                </td>
                <td>
                    <?= $playerHard->totalShotsHit; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Total Playing Time
                </td>
                <td>
                    <?= convertPlayingTime($playerEasy->totalPlayingTime); ?>
                </td>
                <td>
                    <?= convertPlayingTime($playerMedium->totalPlayingTime); ?>
                </td>
                <td>
                    <?= convertPlayingTime($playerHard->totalPlayingTime); ?>
                </td>
            </tr>
        </tbody>
    
    </table>
</div>