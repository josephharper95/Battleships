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
*   V0.15   Joe     01/12/16    added leaderboard tables
*   V0.2    Nick    03/12/16    updated design
*   V0.3    Nick    03/12/16    added accuracy top 10
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

<div id="pageStatisticsCont"
        class="pageContainer">

        <div id="pageStatistics">

            <div id="menu">
                
                <button data-selected="true"
                        data-page="player-stats">
                    Player
                </button>

                <button data-selected="false"
                        data-page="all-scores">
                    Scores
                </button>

                <button data-selected="false"
                        data-page="all-games">
                    Games
                </button>

                <button data-selected="false"
                        data-page="all-shots">
                    Shots
                </button>

            </div>

            <div>

                <div data-page="player-stats"
                        class="subPage">

                        <h2>Player Statistics</h2>

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
                                        Accumulative Score
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
                                        Highest Scoring Game
                                    </td>
                                    <td>
                                        <?= $playerEasy->highScore; ?>
                                    </td>
                                    <td>
                                        <?= $playerMedium->highScore; ?>
                                    </td>
                                    <td>
                                        <?= $playerHard->highScore; ?>
                                    </td>
                                    <td>
                                        <?= $playerMultiplayer->highScore; ?>
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
                                        Complete Game Rate Percentage
                                    </td>
                                    <td>
                                        <?= convertPercentage($playerEasy->gamesPlayed, $playerEasy->gamesPlayed + $playerEasy->incompleteGames); ?>
                                    </td>
                                    <td>
                                        <?= convertPercentage($playerMedium->gamesPlayed, $playerMedium->gamesPlayed + $playerMedium->incompleteGames); ?>
                                    </td>
                                    <td>
                                        <?= convertPercentage($playerHard->gamesPlayed, $playerHard->gamesPlayed + $playerHard->incompleteGames); ?>
                                    </td>
                                    <td>
                                        <?= convertPercentage($playerMultiplayer->gamesPlayed, $playerMultiplayer->gamesPlayed + $playerMultiplayer->incompleteGames); ?>
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

                </div>

                <div data-page="all-scores"
                        class="subPage"
                        style="display:none;">

                    <select>
                        <option value="accumulative">Accumulative Score</option>
                        <option value="high">High Score</option>
                    </select>

                    <div data-table="accumulative"
                            class="tableCont">
                        <h2>Top Ten Accumulative Scores</h2>

                        <table id="topTenScores">
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

                    <div data-table="high"
                            class="tableCont"
                            style="display: none;">
                        <h2>Top Ten High Scores</h2>

                        <table id="topTenHighScores">
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

                </div>

                <div data-page="all-games"
                        class="subPage"
                        style="display:none;">

                    <select>
                        <option value="wins">Games Won</option>
                        <option value="played">Games Played</option>
                        <option value="playingTime">Playing Time</option>
                    </select>

                    <div data-table="wins"
                            class="tableCont">

                        <h2>Top Ten Number of Games Wons</h2>

                        <table id="topTenWins">
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

                    <div data-table="played"
                            class="tableCont"
                            style="display:none;">

                        <h2>Top Ten Games Played</h2>

                        <table id="topTenGamesPlayed">
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

                    <div data-table="playingTime"
                            class="tableCont"
                            style="display:none;">

                        <h2>Top Ten Total Playing Time</h2>

                        <table id="topTenTotalPlayingTime">
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

                </div>

                <div data-page="all-shots"
                        class="subPage"
                        style="display:none;">

                    <select>
                        <option value="fired">Total Fired</option>
                        <option value="hit">Total Hit</option>
                        <option value="received">Total Hits Received</option>
                        <option value="accuracy">Accuracy</option>
                    </select>

                    <div data-table="fired"
                            class="tableCont">

                        <h2>Top Ten Total Shots Fired</h2>

                        <table id="topTenTotalShotsFired">
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

                    <div data-table="hit"
                            class="tableCont"
                            style="display:none;">

                        <h2>Top Ten Total Shots Hit</h2>

                        <table id="topTenTotalShotsHit">
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

                    <div data-table="received"
                            class="tableCont"
                            style="display:none;">

                        <h2>Top Ten Total Hits Received</h2>

                        <table id="topTenTotalHitsReceived">
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

                    <div data-table="accuracy"
                            class="tableCont"
                            style="display:none;">

                        <h2>Top Ten Accuracy</h2>

                        <table id="topTenTotalAccuracy">
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

                </div>

            </div>

        </div>

</div>