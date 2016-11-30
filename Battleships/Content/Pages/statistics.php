<?php

/**
*
*   Last Modified By: Joe Harper
*   Current Version: 0.14
*
*   V0.1    Nick    30/10/16    initial creation
*   V0.11   Nick    01/11/16    added initial data from db
*   V0.12   Nick    01/11/16    added total playing time
*   V0.13   Nick    01/11/16    added accuracy percentage and styling
*   V0.14   Joe     14/11/16    added table entry for multiplayer statistics
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
$multiplayer = $difficulties[3];

$playerEasy = $user->getUserStatisticsByUserIDAndDifficulty($userId, $easy->id)[0];
$playerMedium = $user->getUserStatisticsByUserIDAndDifficulty($userId, $medium->id)[0];
$playerHard = $user->getUserStatisticsByUserIDAndDifficulty($userId, $hard->id)[0];
$playerMultiplayer = $user->getUserStatisticsByUserIDAndDifficulty($userId, $multiplayer->id)[0];

//print_r($playerEasy);

function convertPlayingTime($seconds) {
    $hours = $seconds / 3600  % 24;
    $minutes = $seconds / 60  % 60;
    $seconds = $seconds % 60;

    $result = ($hours < 10 ? "0" . $hours : $hours) . " : " . ($minutes < 10 ? "0" . $minutes : $minutes) . " : " . ($seconds  < 10 ? "0" . $seconds : $seconds);

    return $result;
}

function convertPercentage($small, $large) {
    if ($large == 0 && $small == 0) {
        return "N/A";
    }

    $percent = $small / $large;
    $percent *= 100;

    $percent = number_format($percent, 2);
    $percent .= "%";

    return $percent;
}

?>
<script src="../../Scripts/Pages/statistics.js" type="text/javascript"></script>

<div id="pageStatistics" class="wideWidth">

    <h1>Statistics</h1>

    <h3>Player Statistics</h3>

    <table id="playerStatistics">
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
                <th>
                    Multiplayer
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
                <td>
                    <?= $playerMultiplayer->score; ?>
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
                <td>
                    <?= $playerMultiplayer->wins; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Losses
                </td>
                <td>
                    <?= $playerEasy->gamesPlayed - $playerEasy->wins; ?>
                </td>
                <td>
                    <?= $playerMedium->gamesPlayed - $playerMedium->wins; ?>
                </td>
                <td>
                    <?= $playerHard->gamesPlayed - $playerHard->wins; ?>
                </td>
                <td>
                    <?= $playerMultiplayer->gamesPlayed - $playerMultiplayer->wins; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Completed Games
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
                <td>
                    <?= $playerMultiplayer->gamesPlayed; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Incomplete Games
                </td>
                <td>
                    <?= $playerEasy->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerMedium->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerHard->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerMultiplayer->incompleteGames; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Total Games Started
                </td>
                <td>
                    <?= $playerEasy->gamesPlayed + $playerEasy->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerMedium->gamesPlayed + $playerMedium->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerHard->gamesPlayed + $playerHard->incompleteGames; ?>
                </td>
                <td>
                    <?= $playerMultiplayer->gamesPlayed + $playerMultiplayer->incompleteGames; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Incomplete Game Rate Percentage
                </td>
                <td>
                    <?= convertPercentage($playerEasy->incompleteGames, $playerEasy->gamesPlayed + $playerEasy->incompleteGames); ?>
                </td>
                <td>
                    <?= convertPercentage($playerMedium->incompleteGames, $playerMedium->gamesPlayed + $playerMedium->incompleteGames); ?>
                </td>
                <td>
                    <?= convertPercentage($playerHard->incompleteGames, $playerHard->gamesPlayed + $playerHard->incompleteGames); ?>
                </td>
                <td>
                    <?= convertPercentage($playerMultiplayer->incompleteGames, $playerMultiplayer->gamesPlayed + $playerMultiplayer->incompleteGames); ?>
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
                <td>
                    <?= $playerMultiplayer->totalShotsFired; ?>
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
                <td>
                    <?= $playerMultiplayer->totalShotsHit; ?>
                </td>
            </tr>

            <tr>
                <td>
                    Accuracy
                </td>
                <td>
                    <?= convertPercentage($playerEasy->totalShotsHit, $playerEasy->totalShotsFired); ?>
                </td>
                <td>
                    <?= convertPercentage($playerMedium->totalShotsHit, $playerMedium->totalShotsFired); ?>
                </td>
                <td>
                    <?= convertPercentage($playerHard->totalShotsHit, $playerHard->totalShotsFired); ?>
                </td>
                <td>
                    <?= convertPercentage($playerMultiplayer->totalShotsHit, $playerMultiplayer->totalShotsFired); ?>
                </td>
            </tr>

            <tr>
                <td>
                    Total Shots Received
                </td>
                <td>
                    <?= $playerEasy->totalHitsReceived; ?>
                </td>
                <td>
                    <?= $playerMedium->totalHitsReceived; ?>
                </td>
                <td>
                    <?= $playerHard->totalHitsReceived; ?>
                </td>
                <td>
                    <?= $playerMultiplayer->totalHitsReceived; ?>
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
                <td>
                    <?= convertPlayingTime($playerMultiplayer->totalPlayingTime); ?>
                </td>
            </tr>
        </tbody>
    
    </table>
    <br/>
    <table id="topTenScore">
        <thead>
            <tr>
                <th>
                    Easy
                </th>
                <th>
                    Medium
                </th>
                <th>
                    Hard
                </th>
                <th>
                    Multiplayer
                </th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>