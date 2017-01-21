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
*   V0.5    Nick    25/12/16    stats page now responsive
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
<script src="../../Scripts/Pages/statistics.min.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/statistics.min.css" />

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

                                <table id="playerStatistics"
                                        class="full"></table>

                                <div id="playerStatisticsMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="playerStatisticsMobile"></select>

                                    <div class="tables"></div>
                                </div>
                        </div>

                        <div data-page="all-scores"
                                class="subPage"
                                style="display:none;">

                            <select>
                                <option value="high">High Score</option>
                                <option value="accumulative">Accumulative Score</option>
                            </select>

                            <div data-table="high"
                                    class="tableCont"
                                    style="display: none;">
                                <h2>Top Ten High Scores</h2>

                                <table id="topTenHighScores"
                                        class="full"></table>

                                <div id="topTenHighScoresMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenHighScoresMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="accumulative"
                                    class="tableCont">
                                <h2>Top Ten Accumulative Scores</h2>

                                <table id="topTenScores"
                                        class="full"></table>

                                <div id="topTenScoresMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenScoresMobile"></select>

                                    <div class="tables"></div>
                                </div>
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

                                <table id="topTenWins"
                                        class="full"></table>

                                <div id="topTenWinsMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenWinsMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="played"
                                    class="tableCont"
                                    style="display:none;">

                                <h2>Top Ten Games Played</h2>

                                <table id="topTenGamesPlayed"
                                        class="full"></table>

                                <div id="topTenGamesPlayedMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenGamesPlayedMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="playingTime"
                                    class="tableCont"
                                    style="display:none;">

                                <h2>Top Ten Total Playing Time</h2>

                                <table id="topTenTotalPlayingTime"
                                        class="full"></table>

                                <div id="topTenTotalPlayingTimeMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenTotalPlayingTimeMobile"></select>

                                    <div class="tables"></div>
                                </div>
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

                                <table id="topTenTotalShotsFired"
                                        class="full"></table>

                                <div id="topTenTotalShotsFiredMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenTotalShotsFiredMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="hit"
                                    class="tableCont"
                                    style="display:none;">

                                <h2>Top Ten Total Shots Hit</h2>

                                <table id="topTenTotalShotsHit"
                                        class="full"></table>

                                <div id="topTenTotalShotsHitMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenTotalShotsHitMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="received"
                                    class="tableCont"
                                    style="display:none;">

                                <h2>Top Ten Total Hits Received</h2>

                                <table id="topTenTotalHitsReceived"
                                        class="full"></table>

                                <div id="topTenTotalHitsReceivedMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenTotalHitsReceivedMobile"></select>

                                    <div class="tables"></div>
                                </div>
                            </div>

                            <div data-table="accuracy"
                                    class="tableCont"
                                    style="display:none;">

                                <h2>Top Ten Accuracy</h2>

                                <table id="topTenTotalAccuracy"
                                        class="full"></table>

                                <div id="topTenTotalAccuracyMobile"
                                        class="mobile">

                                    <select class="difficultyOptions"
                                            data-grid="topTenTotalAccuracyMobile"></select>

                                    <div class="tables"></div>
                                </div>
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