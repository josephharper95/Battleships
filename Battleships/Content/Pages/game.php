<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.34
*
* V0.1      Nick    01/10/16    initial creation
* V0.11     Nick    04/10/16    commented code
* V0.2      Nick    07/10/16    changes to implement undo / reset board
* V0.3      Nick    13/10/16    added ability to send in values to the game through POST
* V0.31     Nick    13/10/16    added size attribute onto opponent board as was previously missing
* V0.32     Dave    17/10/16    added scripts to include medium / hard AI
* V0.33     Nick    29/10/16    added perk / sonar pieces
* V0.34     Nick    01/10/16    tracking what difficulty they're on from DB
* V0.35     Nick    07/11/16    missing files
* V0.36     Nick    10/11/16    added rotate ship file
*
**/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check the user is logged in by checking the session variable
if(!Session::get("userID")) {
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

if (!(Input::itemExists("difficulty") && Input::itemExists("size"))) {
    header("Location: startAIGame.php");
    exit();
}

$sizeClass = Input::post("size");
$size;

switch ($sizeClass) {
    case "small":
        $size = 10;
        break;
    case "medium":
        $size = 15;
        break;
    case "large":
        $size = 20;
        break;
}

$difficulty = Input::post("difficulty");
$difficultyText = $difficulty;
$difficultyText[0] = strtoupper($difficultyText[0]);

$userClass = new User();
$dbDifficulties = $userClass->getDifficulties();

foreach ($dbDifficulties as $diff) {
    if (strtolower($difficulty) == strtolower($diff->name)) {
        Session::set("difficultyID", $diff->id);
        break;
    }
}

$userClass->incrementGamesPlayed(Session::get("userID"), Session::get("difficultyID"));

// include the header file if it has not been included before
require_once("header.php");

?>

<!-- Scripts for Computer Game -->
<script src="../../Scripts/Pages/gameComputer.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/boardHover.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/boardUndoReset.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/placePlayerShips.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/placeAIShips.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/playerFireAtComputer.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/aiFireAtPlayer.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/cleanups.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/perkSonar.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/rotateShip.js" type="text/javascript" ></script>

<!-- Classes -->
<script src="../../Scripts/Classes/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AI.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIMedium.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIHard.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Perk.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Sonar.js" type="text/javascript" ></script>

    <!-- set the page width to wide -->
    <div id="pageComputerGame" class="wideWidth">

        <!-- container for all player related items -->
        <div id="playerContainer" class="sideContainer">

            <!-- container for the remaining ships for the player -->
            <div class="boardExtrasContainer">

                <h4>Ships Remaining</h4>

                <!-- container to be populated by ships involved in the game -->
                <ul class="blank remainingShips"></ul>

                <ul class="blank perkContainer">
                    <li>
                        <h3>Perks</h3>
                    </li>
                    <li>
                        <div class="button perk"
                             data-perk="sonar">
                             Sonar
                        </div>
                    </li>
                </ul>

            </div>

            <!-- container for player board -->
            <div class="boardContainer">

                <h3>Player</h3>

                <!-- players board, populated relating to the size -->
                <table id="playerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                    <?php echo createBoard(); ?>
                </table>

                <!-- button to start game, hidden at first -->
                <div style="width: 100%; text-align: center; margin-top:7px;">
                    <button class="button" 
                            style="display:none;"
                            id="startGame" >Start!</button>

                    <button class="button"
                            style="display:none;"
                            id="rotateShip"
                            title="Or press 'r' to rotate">
                        Rotate Ship
                    </button>

                    <button class="button"
                            style="display:none;"
                            id="undoLastShip">
                        Undo Last Ship
                    </button>

                    <button class="button"
                            style="display:none;"
                            id="resetBoard">
                        Reset Board
                    </button>

                    <h3 id="gameMessage"></h3>
                </div>

            </div>

        </div>

        <!-- container for the remaining ships for the opponent -->
        <div id="opponentContainer" class="sideContainer" data-difficulty="<?= $difficulty; ?>">

            <!-- container for the remaining ships for the opponent -->
            <div class="boardExtrasContainer">

                <h4>Ships Remaining</h4>

                <!-- container to be populated by the ships involved in the game -->
                <ul class="blank remainingShips"></ul>
            </div>

            <!-- container for opponent board -->
            <div class="boardContainer">

                <h3>Computer (<?= $difficultyText; ?>)</h3>

                <!-- opponents board, populated relating to the size -->
                <table id="computerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                    <?php echo createBoard(); ?>
                </table>
            </div>
        </div>
    </div>

<?php

// include footer.php if it hasn't been already
require_once("footer.php");

?>

<?php

// function to create board
function createBoard() {
    global $size, $sizeClass; // use global variables

    // initialise return string
    $str = "<tbody>";

    // create board table elements in relation to the size
    for ($i = 0; $i < $size; $i++) {
        $str .= "<tr>";

        for ($x = 0; $x < $size; $x++) {
            $str .= "<td class='$sizeClass'></td>";
        }

        $str .= "</tr>";
    }

    $str.= "</tbody>";

    // return string
    return $str;
}

?>