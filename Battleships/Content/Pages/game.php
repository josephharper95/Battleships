<?php

/**
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
* V0.37     Nick    13/11/16    added new file that has been added
* V0.38     Nick    13/11/16    statistics bug
* V0.39     Nick    28/11/16    updated file locations
* V0.40     Nick    28/11/16    added scoring HTML
* V0.5      Nick    01/12/16    updated design for whole page
* V0.51     Nick    02/12/16    bounce bomb integration
* V0.52     Nick    05/12/16    update for buttons
* V0.53     Nick    06/12/16    added mortar scripts
* V0.54     Nick    07/12/16    added class for birds eye view
* V0.55     Nick    09/12/16    added responsiveness pieces
* V0.56     Nick    12/12/16    added individual CSS file
* V0.57     Nick    22/12/16    added class into board td to allow for image to show on destroy
* V0.58     Nick    17/01/17    changed how maps are laid out on screen
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

// include the header file if it has not been included before
require_once("header.php");

?>

<!-- Scripts for Computer Game -->
<script src="../../Scripts/Pages/gameComputer.js" type="text/javascript"></script>

<script src="../../Scripts/Helpers/boardHover.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/boardUndoReset.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/placePlayerShips.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/placeAIShips.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/playerFireAtComputer.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/aiFireAtPlayer.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/cleanups.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/perkSonar.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/rotateShip.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/setShipAttributes.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/bounceBomb.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/perkMortar.js" type="text/javascript" ></script>

<!-- Classes -->
<script src="../../Scripts/Classes/game.min.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AI.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIMedium.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIHard.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Perk.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Sonar.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/BouncingBomb.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Mortar.min.js" type="text/javascript" ></script>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/game.min.css" />

    <div id="pageSinglePlayerCont"
            class="pageContainer birdsEyeView">

        <div id="pageSinglePlayer"
                class="gameContainer">

            <div id="playerContainer" class="sideContainer">

                <!-- container for the remaining ships for the player -->
                <div class="boardExtrasContainer">

                    <div class="boardExtras">

                        <div class="shipsRemainingCont">

                            <h4>Ships Remaining</h4>

                            <!-- container to be populated by ships involved in the game -->
                            <ul class="blank remainingShips"></ul>

                        </div>

                        <div class="perksCont">

                            <h4>Perks</h4>

                            <ul class="blank perks"></ul>
                        </div>
                    </div>
                </div>

                <!-- container for player board -->
                <div class="boardContainer">

                    <h3>Player</h3>

                    <div class="mapCont">
                        <div class="map"
                                data-size="<?= $sizeClass; ?>"></div>
                    </div>

                    <!-- players board, populated relating to the size -->
                    <table id="playerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                        <?php echo createBoard(); ?>
                    </table>

                    <!-- button to start game, hidden at first -->
                    <div class="buttonContainer">

                        <button class="start" 
                                style="display:none;"
                                id="startGame" >
                                Start!
                        </button>

                        <button class="rotate"
                                style="display:none;"
                                id="rotateShip"
                                title="Or press 'r' to rotate">
                            Rotate Ship
                        </button>

                        <button class="undo"
                                style="display:none;"
                                id="undoLastShip">
                            Undo Ship
                        </button>

                        <button class="reset"
                                style="display:none;"
                                id="resetBoard">
                            Reset Board
                        </button>

                        <h4 id="gameMessage"></h4>

                    </div>
                </div>
            </div>

            <!-- container for the remaining ships for the opponent -->
            <div id="opponentContainer" class="sideContainer" data-difficulty="<?= $difficulty; ?>">

                <!-- container for the remaining ships for the opponent -->
                <div class="boardExtrasContainer">

                    <div class="boardExtras">

                        <div class="shipsRemainingCont">

                            <h4>Ships Remaining</h4>

                            <!-- container to be populated by ships involved in the game -->
                            <ul class="blank remainingShips"></ul>

                        </div>
                    </div>
                </div>

                <!-- container for opponent board -->
                <div class="boardContainer">

                    <h3>Computer (<?= $difficultyText; ?>)</h3>

                    <div class="mapCont" >

                        <div class="map"
                                data-size="<?= $sizeClass; ?>"></div>
                    </div>

                    <!-- opponents board, populated relating to the size -->
                    <table id="computerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                        <?php echo createBoard(); ?>
                    </table>

                    <div class="buttonContainer">

                        <button class="rotate"
                                style="display:none;"
                                id="rotateBounceBomb"
                                title="Or press 'r' to rotate">
                            Rotate
                        </button>
                        
                    </div>
                </div>
            </div>

            <div id="scoreModalOverlay"
                    class="overlay"></div>
            <div id="scoreModal"
                    class="modal"
                    style="display:none;">

                <h1 id="resultTitle"></h1>

                <ul class="blank">

                    <li id="baseScore">
                        <label>Base Score</label>
                        <span>100pts</span>
                    </li>

                    <li id="hitsReceived">
                        <label>Hits Received</label>
                        <span></span>
                    </li>

                    <li id="shotsMissed">
                        <label>Shots Missed</label>
                        <span></span>
                    </li>

                    <li id="shotsHit">
                        <label>Shots Hit</label>
                        <span></span>
                    </li>

                    <li id="timeBonus">
                        <label>Time Bonus</label>
                        <span></span>
                    </li>

                    <li id="winBonus">
                        <label>Win Bonus</label>
                        <span></span>
                    </li>

                    <li id="difficultyMultiplier">
                        <label>Difficulty Multiplier</label>
                        <span></span>
                    </li>

                    <li id="boardSizeBonus">
                        <label>Board Size Bonus</label>
                        <span></span>
                    </li>

                    <li class="line"></li>

                    <li id="total">
                        <label>Total</label>
                        <span></span>
                    </li>

                </ul>

                <div class="buttonContainer">

                    <a href="home.php">Home</a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="game.php">Play Again</a>

                </div>

                <div id="closeModal">X</div>
                
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
            $str .= "<td><i class='hit'></i></td>";
        }

        $str .= "</tr>";
    }

    $str.= "</tbody>";

    // return string
    return $str;
}

?>