<?php
/**
*
* Last Modified By: Joe Harper
* Current Version: 0.1
*
* V0.1      Joe    30/11/16    initial creation
*
**/
$statistics;

require_once("../Classes/setup.php");

if (Input::itemExists("action")) {

    $statistics = new User();

    $action = Input::post("action");

    switch ($action) {
        case "getTopTenUsersScoresByDifficulty":
            getTopTenUsersScoresByDifficulty();
            break;
    }
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

?>