/**
 * Last Modified By: Nick Holdsworth
 * Current Version: 0.61
 *
 *  V0.1    Nick    01/10/16    initial creation
 *  V0.11   Nick    04/10/16    made code stricter and tightened validation and commented
 *  V0.2    Nick    07/10/16    implemented undo place ship / reset board
 *  V0.3    Nick    12/10/16    added ship images
 *  VO.31   Dave    13/10/16    changed AI class to AIMedium
 *  V0.32   Nick    13/10/16    made AI class dynamic based on user selection
 *  V0.33   Nick    15/10/16    stopped user being able to click when game is finished, fixed bug where undo / reset was not actually resetting images
 *  V0.34   Dave    17/10/16    Added AIHard creation.
 *  V0.35   Nick    17/10/16    reformatted methods to be grouped, updated comments to be in line with other files
 *  V0.36   Ncik    17/10/16    added helper method to reduce duplicated code, enemy ship images now show when you destroy a ship
 *  V0.4    Nick    18/10/16    opponent ships show up if you lose
 *  V0.41   Joe     26/10/16    renamed methods
 *  V0.5    Nick    29/10/16    added initial sonar capabilities
 *  V0.6    Nick    01/11/16    tracking statistics
 *  V0.61   Nick    01/11/16    added total playing time
 * 
 */

// Global Variables
var page = "#pageComputerGame";
var playerBoard = "#playerBoard";
var opponentBoard = "#computerBoard";

var game;
var gameStarted = false;
var playerBoardClass;
var opponentBoardClass;
var AI;
var difficulty;
var boardSize;

var totalShots = 0;
var totalHits = 0;
var totalHitsReceived = 0;
var startTime = new Date();

// hard coded ships for the hack
var shipDetails = [
    {
        name: "Destroyer",
        size: 2
    },
    {
        name: "Submarine",
        size: 3
    },
    {
        name: "Cruiser",
        size: 3
    },
    {
        name: "BattleShip",
        size: 4
    },
    {
        name: "Carrier",
        size: 5
    }
];

// initialise the ships to place
var shipsToPlace = new Array();

/**
 * Function once DOM is ready, i.e. once PHP has come back processed
 */
$(document).ready(function () {

    // populate the ships array and the remaining ships containers
    populateShips();

    // allow user to place ships
    initPlaceShips();

    boardSize = $(page + " " + playerBoard + " tr").length;
    difficulty = $("#opponentContainer").data("difficulty");

    // initiliase game object and get the player / computer board
    game = new Game(boardSize);
    playerBoardClass = game.getPlayerBoard();
    opponentBoardClass = game.getComputerBoard();
});

/******************************
 * 
 *      POPULATING SHIPS
 * 
******************************/

/**
 * Function to populate the ships that can be placed into an array and into the reamining ships container in the HTML
 */
function populateShips() {

    var remainingShipsHtml = "";

    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'>" + shipDetails[i].name + "</li>";
    }

    $(".boardExtrasContainer ul.remainingShips").html(remainingShipsHtml);
}

/******************************
 * 
 *       BOARD PLACING
 * 
******************************/

/**
 * Function to place AI ships depending on difficulty
 */
function placeAIShips() {
    // initialise AI
    if (difficulty == "easy") {
        AI = new AI("AI", opponentBoardClass, playerBoardClass);
    } else if (difficulty == "medium") {
        AI = new AIMedium("AI", opponentBoardClass, playerBoardClass);
    } else if (difficulty == "hard") {
        AI = new AIHard("AI", opponentBoardClass, playerBoardClass);
    }

    // invoke the place ships method
    AI.placeShips();
}

/******************************
 * 
 *        BOARD FIRING
 * 
******************************/

/**
 * Function to allow player to make a move
 */
function playerMove() {
    
    // validation check to ensure the game is viable
    if (game.isViable()) {

        // add a mouseenter handler onto the computer's board cells
        $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

            // initialise cell
            var $cell = $(this);

            // run hover function
            var canFire = boardFireHover($cell);

            // validation to ensure user can fire
            if (canFire) {

                // remove any extra click handlers and add a fresh one
                $cell.unbind("click").one("click", function () {

                    // invoke method to fire at opponent
                    boardFireAtOpponent($cell);

                    // cleanups
                    removeHovers();
                    cleanupHoverClasses();

                    // change turn to be AI
                    AIMove();
                });
            } else {
                cleanupHoverClasses();
            }

            // add mouseleave handler to cleanup any hovers
            $cell.bind("mouseleave", function () {
                cleanupHoverClasses();
            });
        });

        $(".perkContainer .perk.button:not(.disabled)").unbind("click").one("click", function () {
            
            removeHovers();
            disablePerks();

            var perkCell = $(this);
            var perk = $(perkCell).data("perk");

            runPlayerPerk(perk);
        });
    } else {

        // if game is not viable, end game
        endGame("opponent");
    }
}

/**
 * Function to handle the firing on the opponent's board
 */
function boardFireAtOpponent($cell) {

    // if the cell exists
    if ($cell) {

        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // return boolean of whether player has hit a shit
        var hit = opponentBoardClass.fire(x, y);

        // if a ship was hit...
        if (hit) {

            totalHits++;

            // add a class to the cell so that it knows that it contains a ship
            $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("containsShip");

            // get the coordinate object at the coordinates
            var coord = opponentBoardClass.getCoordinateAt(x, y);

            // get the ship object at the coordinate
            var ship = coord.getShip();

            // validation check to make sure that the ship exists§
            if (ship) {
                
                // check whether the ship has been destroyed
                if (ship.isDestroyed()) {

                    setShipAttributesOnBoard(opponentBoard, ship);
                    
                    // add a class to let the remaining ships container know that the ship has been destroyed
                    $("#opponentContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
                }
            }
        }
        
        // let the cell know it has been hit
        totalShots++;
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");
    }
}

/**
 * Function to allow AI to make a move
 */
function AIMove() {

    // validation check to ensure game is viable
    if (game.isViable()) {

        // remove handler from computer board so player cannot cheat
        $(page + " " + opponentBoard + " td").unbind("mouseenter").unbind("mouseleave");

        // ensure all click handlers are removed so user cannot cheat
        $(page + " " + opponentBoard + " td").unbind("click");

        // invoke fire method from AI and return coordinates hit
        var coords = AI.fire();

        // add hit class to coordinate
        $(page + " " + playerBoard + " tr:eq(" + coords.getY() + ") > td:eq(" + coords.getX() + ")").addClass("hit");

        // get coordinate and ship object
        var coord = playerBoardClass.getCoordinateAt(coords.getX(), coords.getY());
        var ship = coord.getShip();

        // validation check to see if coordinate contains a ship
        if (ship) {

            totalHitsReceived++;
            
            // check if ship is destroyed
            if (ship.isDestroyed()) {

                // if ship is destroyed, update remaining ships
                $("#playerContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }

        // player's turn
        playerMove();
    } else {

        // if game is not viable, end
        endGame("player");
    }
}

/******************************
 * 
 *           PERKS
 * 
 ******************************/

/**
 * Make buttons look disabled
 */
function disablePerks() {
    $(".perkContainer .perk.button").addClass("disabled");
}

/**
 * Make buttons look enabled
 */
function enablePerks() {
    $(".perkContainer .perk.button").removeClass("disabled");
}

/**
 * Initial function that gets the perk and decides how to respond
 */
function runPlayerPerk(perk) {

    switch (perk) {
        case "sonar":
            initSonarPerk();
    }
}

function endPlayerPerk() {
    enablePerks();
    playerMove();
}

/******************************
 * 
 *        SONAR PERK
 * 
******************************/

function initSonarPerk() {

    $(page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + opponentBoard + " td").unbind("mouseleave");

    $(page + " " + opponentBoard + " td").bind("mouseenter", function (e) {

        //var $cell = $(this);
        var $cell = $(this);

        // remove all hover classes
        cleanupHoverClasses();
        
        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        sonarPerkHover(x, y);

        //if (canFire) {
            
        $cell.off("click").one("click", function () {

            // remove all hover classes
            cleanupHoverClasses();

            var sonar = new Sonar(opponentBoardClass);

            var cell = sonar.action(x, y);

            if (cell) {

                $(page + " " + opponentBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");

            } else {
                alert("no moves found :(");
            }

            // allow player to now make a move
            enablePerks();
            playerMove();
        });
        //}
    });
}

function sonarPerkHover(x, y) {

    //var canFire = computerBoard.canFire(x, y);

    //if (canFire) {

        var lowX = (x - 1) >= 0 ? true : false;
        var highX = (x + 1) < boardSize ? true : false;
        var lowY = (y - 1) >= 0 ? true : false;
        var highY = (y + 1) < boardSize ? true : false;

        // TOP ROW
        if (highY) {

            if (lowX) {
                $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            }

            $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + x + ")").addClass("hover");
            
            if (highX) {
                $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            }

        }

        // MIDDLE ROW
        if (lowX) {
            $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x - 1) + ")").addClass("hover");
        }

        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");

        if (highX) {
            $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x + 1) + ")").addClass("hover");
        }

        // BOTTOM ROW
        if (lowY) {

            if (lowX) {
                $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            }

            $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + x + ")").addClass("hover");

            if (highX) {
                $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            }
        }
        
        //return true;
    //}

    //return false;
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

// function to invoke when the game is ready to start playing
function gameReady() {
    // cleanups
    removeHovers();
    $(window).unbind("keydown");

    // show the start game button
    $("#startGame").fadeIn(500);
    
    // add click handler to the button at this point
    $("#startGame").unbind("click").one("click", function () {

        // on click - fade button out
        $("#startGame").fadeOut(500);

        // invoke method startGame
        startGame();
    });
}

// function to start the game officially
function startGame() {

    // set the variable so other methods know the game has begun
    gameStarted = true;

    $("#resetBoard").fadeOut(500).unbind("click");
    $("#undoLastShip").fadeOut(500).unbind("click");

    $(".boardExtrasContainer").fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    // let the player have the first move
    playerMove();    
}

// function to end game - HACK
function endGame(winner) {

    removeClicks();
    removeHovers();
    disablePerks();

    var endTime = new Date();
    var playingTime = (endTime.getTime() - startTime.getTime()) / 1000;

    // alert appropriate message
    if (winner == "player") {
        $.ajax({
            url: "../../Content/Pages/gameAjax.php",
            data: {
                action: "recordWin"
            },
            type: "post"
        });

        alert("Game Over! - You Won! :)");
    } else {
        alert("Game Over! - You Lost! :(");
        showOpponentShips();
    }

    $.ajax({
            url: "../../Content/Pages/gameAjax.php",
            data: {
                action: "recordShots",
                totalHits: totalHits,
                totalHitsReceived: totalHitsReceived,
                totalShots: totalShots,
                playingTime: playingTime
            },
            type: "post"
        });
}

/******************************
 * 
 *      POST GAME EVENTS
 * 
******************************/

/**
 * Function to show opponent ships if you lose
 */
function showOpponentShips() {
    var remainingShips = opponentBoardClass.floatingShips();

    for (var i = 0; i < remainingShips.length; i++) {
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

/******************************
 * 
 *       HELPER METHODS
 * 
******************************/

/**
 * Set the attributes for images on board
 */
function setShipAttributesOnBoard(board, ship) {

    var coords = ship.getCoordinates();

    // recurse through the coordinates
    for (i = 0; i < coords.length; i++) {

        // set a variable for the individual coordinate
        var c = coords[i];

        // add the appropriate class to each cell
        var cell = $(board + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")")[0];
        
        $(cell).attr("data-ship", ship.getName());
        $(cell).attr("data-orientation", (ship.getOrientation() == 0 ? "Vertical" : "Horizontal"));
        $(cell).attr("data-ship-part", i);

        if (!$(cell).hasClass("containsShip")) {
            $(cell).addClass("containsShip");
        }
    }
}