<?php

/**
*
*   V0.1    Nick    30/10/16    initial creation
*   V0.11   Nick    01/11/16    added initial data from db
*   V0.12   Nick    01/11/16    added total playing time
*   V0.13   Nick    01/11/16    added accuracy percentage and styling
*   V0.14   Joe     14/11/16    added table entry for multiplayer statistics
*   V0.15   Joe     01/12/16    added leaderboard tables
*   V0.2    Nick    03/12/16    updated design
*   V0.3    Nick    03/12/16    added accuracy top 10
*   V0.4    Nick    07/12/16    tweaked HTML and added objects
*   V0.41   Nick    12/12/16    added individual CSS file
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

<link rel="stylesheet" type="text/css" href="../Styles/Pages/statistics.css" />

<div id="pageStatisticsCont"
        class="pageContainer birdsEyeView">

        <div id="pageStatistics">

            <div id="folderCont">
                <div id="folder">

                    <div id="folderMenu">
                        
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

                    <div class="folderArea">

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
                                                <?= $playerEasy ? $playerEasy->score : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->score : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->score : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->score : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Highest Scoring Game
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->highScore : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->highScore : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->highScore : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->highScore : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Wins
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->wins : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Losses
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->gamesPlayed - $playerEasy->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->gamesPlayed - $playerMedium->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->gamesPlayed - $playerHard->wins : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->gamesPlayed - $playerMultiplayer->wins : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Completed Games
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->gamesPlayed : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->gamesPlayed : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->gamesPlayed : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->gamesPlayed : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Incomplete Games
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->incompleteGames : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Total Games Started
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->gamesPlayed + $playerEasy->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->gamesPlayed + $playerMedium->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->gamesPlayed + $playerHard->incompleteGames : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->gamesPlayed + $playerMultiplayer->incompleteGames : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Complete Game Rate Percentage
                                            </td>
                                            <td>
                                                <?= $playerEasy ? convertPercentage($playerEasy->gamesPlayed, $playerEasy->gamesPlayed + $playerEasy->incompleteGames) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? convertPercentage($playerMedium->gamesPlayed, $playerMedium->gamesPlayed + $playerMedium->incompleteGames) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? convertPercentage($playerHard->gamesPlayed, $playerHard->gamesPlayed + $playerHard->incompleteGames) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? convertPercentage($playerMultiplayer->gamesPlayed, $playerMultiplayer->gamesPlayed + $playerMultiplayer->incompleteGames) : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Total Shots Fired
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->totalShotsFired : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->totalShotsFired : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->totalShotsFired : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->totalShotsFired : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Total Shots Hit
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->totalShotsHit : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->totalShotsHit : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->totalShotsHit : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->totalShotsHit : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Accuracy
                                            </td>
                                            <td>
                                                <?= $playerEasy ? convertPercentage($playerEasy->totalShotsHit, $playerEasy->totalShotsFired) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? convertPercentage($playerMedium->totalShotsHit, $playerMedium->totalShotsFired) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? convertPercentage($playerHard->totalShotsHit, $playerHard->totalShotsFired) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? convertPercentage($playerMultiplayer->totalShotsHit, $playerMultiplayer->totalShotsFired) : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Total Shots Received
                                            </td>
                                            <td>
                                                <?= $playerEasy ? $playerEasy->totalHitsReceived : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? $playerMedium->totalHitsReceived : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? $playerHard->totalHitsReceived : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? $playerMultiplayer->totalHitsReceived : 'Data Error'; ?>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Total Playing Time
                                            </td>
                                            <td>
                                                <?= $playerEasy ? convertPlayingTime($playerEasy->totalPlayingTime) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMedium ? convertPlayingTime($playerMedium->totalPlayingTime) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerHard ? convertPlayingTime($playerHard->totalPlayingTime) : 'Data Error'; ?>
                                            </td>
                                            <td>
                                                <?= $playerMultiplayer ? convertPlayingTime($playerMultiplayer->totalPlayingTime) : 'Data Error'; ?>
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

                                <h2>Top Ten Number of Games Won</h2>

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

            <div class="telephone object"></div>
            <div class="teacup object"></div>
            <div class="teacup-stain object"></div>
            <div class="slider object"></div>
            <div class="destroyer object"></div>
            <div class="submarine object"></div>
            <div class="cruiser object"></div>
            <div class="battleship object"></div>
            <div class="carrier object"></div>

        </div>

</div>