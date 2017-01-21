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
*   V0.8    Nick    17/01/17    island warfare added
*   V0.9    Nick    18/01/17    outro modal
*   V0.91   Nick    18/01/17    change to width of button
*   V1.0    Nick    18/01/17    mission text updated
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
        $missionText = "Only your destroyer survived the last attack.
                        You're in the ocean... alone.
                        A new full wave of enemy ships is fast approaching you.
                        Position your ship to fend off the enemy.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "hardcore":

        $character = "enemy";
        $missionTitle = "Hardcore";
        $missionText = "You have suffered a tremendous hit.
                        Only your main cannon works.
                        On top of this, your sonar ship detection has broken.
                        You will know you have hit an enemy ship, but you won't know if that ship has been sunk.
                        Good luck Corporal.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "fog-of-war":

        $character = "friendly";
        $missionTitle = "Fog of War";
        $missionText = "You have lost communications with your allies on shore. 
                        Your sonar system has been damaged by a recent attack so you are unaware if you have sunk your enemy ships.
                        The fog has limited your ability to fire shots so you can only user your mortar shot.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "against-the-clock":

        $character = "friendly";
        $missionTitle = "Against the Clock";
        $missionText = "Time is running out.
                        You need to sink the enemy ships before the countdown finishes.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;

    case "pearl-harbour":

        $character = "friendly";
        $missionTitle = "Pearl Harbour";
        $missionText = "The enemy has called in a squadron to aid their attack.
                        You need to defeat the enemy including their squadron.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Medium";
        break;

    case "island-warfare":

        $character = "friendly";
        $missionTitle = "Island Warfare";
        $missionText = "Your battle field contains islands.
                        You need to place your ships around these islands and defeat your enemy.";
        $sizeClass = "medium";
        $size = 15;
        $difficultyText = "Hard";
        break;
}

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
<script src="../../Scripts/Helpers/boardHover.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/boardUndoReset.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/placePlayerShips.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/placeAIShips.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/playerFireAtComputer.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/aiFireAtPlayer.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/cleanups.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/perkSonar.min.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/rotateShip.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/setShipAttributes.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/bounceBomb.min.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/perkMortar.min.js" type="text/javascript" ></script>

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

<script src="../../Scripts/Pages/mission.min.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/game.min.css" />
<link rel="stylesheet" type="text/css" href="../Styles/Pages/mission.min.css" />

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

                    <h3><?= $missionTitle; ?></h3>

                    <div class="mapCont">
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

                <div class="buttonContainer"
                    id="introButtons">
                    
                    <a href="missionList.php">Back</a>
                    <button id="acceptMission">Accept</button>
                </div>

                <div class="buttonContainer"
                    id="outroButtons"
                    style="display:none;">

                    <a href="missionList.php"
                        style="width: 200px;">Back to Missions</a>
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