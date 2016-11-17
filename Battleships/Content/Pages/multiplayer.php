<?php

/**
*
* Last Modified By: Nick Holdsworth
*
* V0.1      Nick    07/11/16    initial creation
* V0.11     Nick    09/11/16    added pieces for creating / leaving
* V0.12     Nick    09/11/16    renamed to games rather than rooms
* V0.13     Nick    09/11/16    page redirection bug
* V0.2      Nick    13/11/16    added files for classes / scripts, markup for boards
* V0.3      Nick    14/11/16    opponent's username gets populated
* V0.4      Nick    17/11/16    added back to multiplayer button
*
*/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

require_once("header.php");

?>

<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.0.3.js"></script>

<script src="../../Scripts/Pages/multiplayer.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/boardHover.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/boardUndoReset.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/placePlayerShips.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/cleanups.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/perkSonar.js" type="text/javascript"></script>
<script src="../../Scripts/Pages/rotateShip.js" type="text/javascript" ></script>
<script src="../../Scripts/Pages/setShipAttributes.js" type="text/javascript" ></script>

<!-- Classes -->
<script src="../../Scripts/Classes/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.js" type="text/javascript" ></script>

<div id="pageMultiplayer">
    
    <div class="standardWidth">
        <h1 class="pageTitle">Multiplayer</h1>

        <button id="backToMultiplayer"
                style="display:none;">
            Back to Multiplayer
        </button>
    </div>

    <div id="subPageRoom"
         class="subPage standardWidth">

        <button id="createGame">
            Create Room
        </button>

        <div class="clear"></div>

        <h3>Available Games</h3>

        <ul id="availableRooms"
            class="blank"></ul>

    </div>

    <div id="subPagePlayGame"
         class="subPage wideWidth"
         style="display:none;clear:both;">

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
                        <!-- TODO NEH: not implemented yet -->
                        <!--<div class="button perk"
                             data-perk="sonar">
                             Sonar
                        </div>-->
                    </li>
                </ul>

            </div>

            <!-- container for player board -->
            <div class="boardContainer">

                <h3>Player</h3>

                <!-- players board, populated relating to the size -->
                <table id="playerBoard" class="board" data-size="small" >
                    <?php echo createBoard(); ?>
                </table>

                <!-- button to start game, hidden at first -->
                <div style="width: 100%; text-align: center; margin-top:7px;">
                    <button class="button" 
                            style="display:none;"
                            id="playerReady" >
                            Ready
                    </button>

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
        <div id="opponentContainer" class="sideContainer">

            <!-- container for the remaining ships for the opponent -->
            <div class="boardExtrasContainer">

                <h4>Ships Remaining</h4>

                <!-- container to be populated by the ships involved in the game -->
                <ul class="blank remainingShips"></ul>
            </div>

            <!-- container for opponent board -->
            <div class="boardContainer">

                <h3 id="opponentName" >Opponent</h3>

                <!-- opponents board, populated relating to the size -->
                <table id="opponentBoard" class="board" data-size="small" >
                    <?php echo createBoard(); ?>
                </table>
            </div>
        </div>
    </div>
</div>

<?php

// function to create board
function createBoard() {

    $size = 10;
    $sizeClass = "small";

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