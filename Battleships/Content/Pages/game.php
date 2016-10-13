<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/10/16    initial creation
* V0.11     Nick    04/10/16    commented code
* V0.2      Nick    07/10/16    changes to implement undo / reset board
*
**/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check the user is logged in by checking the session variable
if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

// include the header file if it has not been included before
require_once("header.php");

// fix the size to small (10x10) -- HACK
$size = 10;
$class = "small";

?>

<!-- script files to include -->
<script src="../../Scripts/Pages/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AI.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/AIMedium.js" type="text/javascript" ></script>

<body>

    <!-- set the page width to wide -->
    <div id="pageGame" class="wideWidth">

        <!-- container for all player related items -->
        <div id="playerContainer" class="sideContainer">

            <!-- container for the remaining ships for the player -->
            <div class="remainingShipsContainer">

                <h4>Ships Remaining</h4>

                <!-- container to be populated by ships involved in the game -->
                <ul class="blank"></ul>

            </div>

            <!-- container for player board -->
            <div class="boardContainer">

                <h3>Player</h3>

                <!-- players board, populated relating to the size -->
                <table id="boardPlayer" class="board" data-size="<?= $class ?>" >
                    <?php echo createBoard(); ?>
                </table>

                <!-- button to start game, hidden at first -->
                <div style="width: 100%; text-align: center; margin-top:7px;">
                    <button class="button" 
                            style="display:none;"
                            id="startGame" >Start!</button>

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
        <div id="opponentContainer" class="sideContainer">

            <!-- container for the remaining ships for the opponent -->
            <div class="remainingShipsContainer">

                <h4>Ships Remaining</h4>

                <!-- container to be populated by the ships involved in the game -->
                <ul class="blank"></ul>
            </div>

            <!-- container for opponent board -->
            <div class="boardContainer">

                <h3>Computer</h3>

                <!-- opponents board, populated relating to the size -->
                <table id="boardComputer" class="board" >
                    <?php echo createBoard(); ?>
                </table>
            </div>
        </div>
    </div>
</body>

</html>

<?php

// include footer.php if it hasn't been already
require_once("footer.php");

?>

<?php

// function to create board
function createBoard() {
    global $size, $class; // use global variables

    // initialise return string
    $str = "<tbody>";

    // create board table elements in relation to the size
    for ($i = 0; $i < $size; $i++) {
        $str .= "<tr>";

        for ($x = 0; $x < $size; $x++) {
            $str .= "<td class='$class'></td>";
        }

        $str .= "</tr>";
    }

    $str.= "</tbody>";

    // return string
    return $str;
}

?>