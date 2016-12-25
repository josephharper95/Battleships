<?php
/**
*
* Last Modified By: Joe Harper
* Current Version: 0.1
*
* V0.1      Joe     30/11/16    initial creation
* V0.2      Joe     01/12/16    added all get methods
* V0.3      Nick    02/12/16    added multiplayer stats 
* V0.4      Nick    03/12/16    added top ten accuracy
* V0.5      Nick    25/12/16    added user stats in here instead of statistics.php
*
**/
$statistics;

require_once("../Classes/setup.php");

if (Input::itemExists("action")) {

    $statistics = new User();

    $action = Input::post("action");

    switch ($action) {

        case "getTopTenUserStatsByUserIdAndDifficulty":
            getTopTenUserStatsByUserIdAndDifficulty();
            break;

        case "getTopTenUsersScoresByDifficulty":
            getTopTenUsersScoresByDifficulty();
            break;

        case "getTopTenUsersHighScoresByDifficulty":
            getTopTenUsersHighScoresByDifficulty();
            break;

        case "getTopTenUsersWinsByDifficulty":
            getTopTenUsersWinsByDifficulty();
            break;

        case "getTopTenUsersGamesPlayedByDifficulty":
            getTopTenUsersGamesPlayedByDifficulty();
            break;

        case "getTopTenUsersTotalShotsFiredByDifficulty":
            getTopTenUsersTotalShotsFiredByDifficulty();
            break;

        case "getTopTenUsersTotalShotsHitByDifficulty":
            getTopTenUsersTotalShotsHitByDifficulty();
            break;

        case "getTopTenUsersTotalHitsReceivedByDifficulty":
            getTopTenUsersTotalHitsReceivedByDifficulty();
            break;

        case "getTopTenUsersTotalPlayingTimeByDifficulty":
            getTopTenUsersTotalPlayingTimeByDifficulty();
            break;

        case "getTopTenUsersHitAccuracyByDifficulty":
            getTopTenUsersHitAccuracyByDifficulty();
            break;

        case "multiplayerStats":
            getMultiplayersStats();
            break;
    }
}

function getTopTenUserStatsByUserIdAndDifficulty() {

    global $statistics;

    $userId = Session::get("userID");
    
    $returnVal = [];
    $returnVal["easy"] = $statistics->getUserStatisticsByUserIDAndDifficulty($userId, 1)[0];
    $returnVal["medium"] = $statistics->getUserStatisticsByUserIDAndDifficulty($userId, 2)[0];
    $returnVal["hard"] = $statistics->getUserStatisticsByUserIDAndDifficulty($userId, 3)[0];
    $returnVal["multiplayer"] = $statistics->getUserStatisticsByUserIDAndDifficulty($userId, 4)[0];

    echo json_encode($returnVal);
}

function getTopTenUsersScoresByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersScoresByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersScoresByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersScoresByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersScoresByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersHighScoresByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersHighScoresByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersHighScoresByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersHighScoresByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersHighScoresByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersWinsByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersWinsByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersWinsByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersWinsByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersWinsByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersGamesPlayedByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersGamesPlayedByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersGamesPlayedByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersGamesPlayedByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersGamesPlayedByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersTotalShotsFiredByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersTotalShotsFiredByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersTotalShotsFiredByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersTotalShotsFiredByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersTotalShotsFiredByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersTotalShotsHitByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersTotalShotsHitByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersTotalShotsHitByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersTotalShotsHitByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersTotalShotsHitByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersTotalHitsReceivedByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersTotalHitsReceivedByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersTotalHitsReceivedByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersTotalHitsReceivedByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersTotalHitsReceivedByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersTotalPlayingTimeByDifficulty() {

    global $statistics;

    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersTotalPlayingTimeByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersTotalPlayingTimeByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersTotalPlayingTimeByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersTotalPlayingTimeByDifficulty(4);

    echo json_encode($returnVal);
}

function getTopTenUsersHitAccuracyByDifficulty() {

    global $statistics;
    
    $returnVal = [];
    $returnVal["easy"] = $statistics->getTopTenUsersHitAccuracyByDifficulty(1);
    $returnVal["medium"] = $statistics->getTopTenUsersHitAccuracyByDifficulty(2);
    $returnVal["hard"] = $statistics->getTopTenUsersHitAccuracyByDifficulty(3);
    $returnVal["multiplayer"] = $statistics->getTopTenUsersHitAccuracyByDifficulty(4);

    echo json_encode($returnVal);
}

function getMultiplayersStats() {

    global $statistics;

    echo json_encode($statistics->getMultiplayerDataByUserID(Session::get("userID")));
}

?>