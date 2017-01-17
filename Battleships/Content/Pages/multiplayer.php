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
* V0.41     Nick    28/11/16    update file locations - commented out perks
* V0.5      Nick    28/11/16    added scoring HTML
* V0.6      Nick    02/12/16    design integration and initial perks
* V0.7      Nick    05/12/16    bounce bomb rotation, button design
* V0.71     Nick    07/12/16    added class for birds eye view
* V0.72     Nick    09/12/16    extra pieces for responsiveness
* V0.73     Nick    12/12/16    added individual CSS file
* V0.74     Nick    28/12/16    CSS now loaded first to stop FoUC
* V0.8      Nick    17/01/17    changed maps
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

<link rel="stylesheet" type="text/css" href="../Styles/Pages/game.css" />
<link rel="stylesheet" type="text/css" href="../Styles/Pages/multiplayer.css" />

<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.0.3.js"></script>

<script src="../../Scripts/Pages/multiplayer.js" type="text/javascript"></script>

<script src="../../Scripts/Helpers/boardHover.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/boardUndoReset.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/placePlayerShips.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/cleanups.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/perkSonar.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/bounceBomb.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/perkMortar.js" type="text/javascript"></script>
<script src="../../Scripts/Helpers/rotateShip.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/setShipAttributes.js" type="text/javascript" ></script>
<script src="../../Scripts/Helpers/conversions.js" type="text/javascript" ></script>

<!-- Classes -->
<script src="../../Scripts/Classes/game.js" type="text/javascript"></script>
<script src="../../Scripts/Classes/ship.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/board.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/coordinate.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Perk.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Sonar.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/BouncingBomb.js" type="text/javascript" ></script>
<script src="../../Scripts/Classes/Mortar.js" type="text/javascript" ></script>

<div id="pageMultiplayer"
        class="pageContainer">
    
    <div class="standardWidth">
        <h1 class="pageTitle">Multiplayer</h1>

        <button id="backToMultiplayer"
                style="display:none;">
            Back to Multiplayer
        </button>
    </div>

    <div id="subPageRoom"
         class="subPage pageContainer">

         <div id="availableGamesCont">

             <h2>Available Games</h2>

             <button id="createGame">
                Create Room
            </button>

            <table id="availableRooms">
                <thead>
                    <tr>
                        <th>
                            Username
                        </th>
                        <th>
                            Board Size
                        </th>
                        <th>
                            High Score
                        </th>
                        <th>
                            Completion Rate
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4">
                            No games found!
                        </td>
                    </tr>
                </tbody>
            </table>

         </div>

         <div id="createGameCont">

             <h2>Board Size</h2>

            <ul class="blank">

                <li>
                    <input type="radio" 
                            id="small" 
                            name="size"
                            value="small"
                            checked />
                    <label for="small">
                        <span></span>
                        Small (10x10)
                    </label>
                </li>

                <li>
                    <input type="radio" 
                            id="medium" 
                            name="size"
                            value="medium" />
                    <label for="medium">
                        <span></span>
                        Medium (15x15)
                    </label>
                </li>

                <li>
                    <input type="radio" 
                            id="large" 
                            name="size"
                            value="large" />
                    <label for="large">
                        <span></span>
                        Large (20x20)
                    </label>
                </li>
            </ul>

            <button id="createRoomButtonConf">
                Create
            </button>

            <button id="createRoomButtonCancel">
                Cancel
            </button>

         </div>

    </div>

    <div id="subPagePlayGame"
         class="subPage gameContainer pageContainer"
         style="display:none;clear:both;">

         <!-- container for all player related items -->
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
                <table id="playerBoard" class="board" data-size="small" ></table>

                <div class="mapCont">
                    <div class="map"
                            data-size="<?= $sizeClass; ?>"></div>
                </div>

                <!-- button to start game, hidden at first -->
                <div class="buttonContainer">
                    <button class="start" 
                            style="display:none;"
                            id="playerReady" >
                            Ready
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

                    <h3 id="gameMessage"></h3>

                </div>
            </div>
        </div>

        <!-- container for the remaining ships for the opponent -->
        <div id="opponentContainer" class="sideContainer">

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

                <h3 id="opponentName" >Opponent</h3>

                <!-- opponents board, populated relating to the size -->
                <table id="opponentBoard" class="board" data-size="small" ></table>

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
                <div id="scoreBackToMultiplayer"
                        class="link">Back to Multiplayer</div>

            </div>

            <div id="closeModal">X</div>
            
        </div>
    </div>
</div>