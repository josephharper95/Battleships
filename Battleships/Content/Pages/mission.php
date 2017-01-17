<?php

/**
*
*   V0.1    Nick    19/12/16    initial creation
*   V0.2    Nick    21/12/16    hardcore pieces added into switch
*   V0.3    Nick    21/12/16    fog of war pieces added into switch
*   V0.4    Nick    21/12/16    against the clock implemented
*   V0.5    Nick    22/12/16    added piece to add image on ship hit, and included game.css
*   V0.6    Nick    10/01/17    added pearl harbour into switch
*   V0.7    Nick    17/01/17    added initials to waves
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

if (!(Input::itemExists("missionName"))) {
    header("Location: missionList.php");
    exit();
}

$mission = Input::post("missionName");
$character;
$missionTitle;
$missionText;

$sizeClass;
$size;
$difficultyText;

switch ($mission) {

    case "last-stand":

        $character = "friendly";
        $missionTitle = "Last Stand";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "hardcore":

        $character = "enemy";
        $missionTitle = "Hardcore";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "fog-of-war":

        $character = "friendly";
        $missionTitle = "Fog of War";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "against-the-clock":

        $character = "friendly";
        $missionTitle = "Against the Clock";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "pearl-harbour":

        $character = "friendly";
        $missionTitle = "Pearl Harbour";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Medium";
        break;

    case "waves":

        $character = "friendly";
        $missionTitle = "Waves";
        $missionText = "This is a lot of text so that we can simulate how the page will look. If you are reading this, you may have too much time on your hands...";
        $sizeClass = "large";
        $size = 20;
        $difficultyText = "Easy";
        break;
}

$missionSplit = explode("-", $mission);

for ($i = 0; $i < count($missionSplit); $i++) {

    

    $missionSplit[$i][0] = strtoupper($missionSplit[$i][0]);
}

$missionName = implode($missionSplit);

require_once("header.php");

?>

<script type="text/javascript">

    var mission = {
        name: <?= json_encode($mission); ?>,
        title: <?= json_encode($missionTitle); ?>,
        text: <?= json_encode($missionText); ?>,
        boardSize: <?= json_encode($size); ?>,
        difficulty: <?= json_encode($difficultyText); ?>
    };

</script>

<!-- Scripts -->
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
<script src="../../Scripts/Classes/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AI.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIMedium.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIHard.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Perk.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Sonar.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/BouncingBomb.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Mortar.js" type="text/javascript" ></script>

<script src="../../Scripts/Pages/mission.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/game.css" />
<link rel="stylesheet" type="text/css" href="../Styles/Pages/mission.css" />

<div id="pageMissionCont"
        class="pageContainer birdsEyeView">

    <div id="pageMission"
            class="gameContainer">

        <div id="game">

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

                    <!-- players board, populated relating to the size -->
                    <table id="playerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                        <?php echo createBoard(); ?>
                    </table>

                    <div class="mapCont">
                        <div class="map"
                                data-size="<?= $sizeClass; ?>"></div>
                    </div>

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
            <div id="opponentContainer" class="sideContainer" data-size="<?= $sizeClass; ?>">

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

                    <h3><?= $missionName; ?></h3>

                    <!-- opponents board, populated relating to the size -->
                    <table id="computerBoard" class="board" data-size="<?= $sizeClass; ?>" >
                        <?php echo createBoard(); ?>
                    </table>

                    <div class="mapCont">
                        <div class="map"
                                data-size="<?= $sizeClass; ?>"></div>
                    </div>

                    <div class="buttonContainer">

                        <button class="rotate"
                                style="display:none;"
                                id="rotateBounceBomb"
                                title="Or press 'r' to rotate">
                            Rotate
                        </button>

                        <h4 class="gameMessage"></h4>
                    </div>
                </div>
            </div>
        </div>

        <div id="introOverlay"></div>
        <div id="intro">

            <div id="character"
                    class="<?= $character ?>"></div>

            <div id="message">
                <p></p>

                <div id="buttonContainer">
                    
                    <button>Back</button>
                    <button id="acceptMission">Accept</button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php

// include footer.php if it hasn't been already
require_once("footer.php");

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