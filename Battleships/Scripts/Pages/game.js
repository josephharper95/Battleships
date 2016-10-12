/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/10/16    initial creation
* V0.11     Nick    04/10/16    made code stricter and tightened validation and commented
* V0.2      Nick    07/10/16    implemented undo place ship / reset board
* V0.3      Nick    12/10/16    added ship images
*
**/

// Global Variables
var game;
var gameStarted = false;
var playerBoard;
var computerBoard;
var AI;

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

// once the DOM is ready...
$(document).ready(function () {

    // populate the ships array and the remaining ships containers
    populateShips();

    // allow user to place ships
    initPlaceShips();

    var boardSize;

    switch ($("#boardPlayer").data("size")) {
        case "small":
            boardSize = 10
            break;
        case "medium":
            boardSize = 15;
            break;
        case "large":
            boardSize = 20;
            break;
    }

    // initiliase game object and get the player / computer board
    game = new Game(boardSize);
    playerBoard = game.getPlayerBoard();
    computerBoard = game.getComputerBoard();
});

// function to populate the ships that can be placed array and the reamining ships container HTML
function populateShips() {

    var remainingShipsHtml = "";

    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'>" + shipDetails[i].name + "</li>";
    }

    $(".remainingShipsContainer ul").html(remainingShipsHtml);
}

// function to allow user to place a ship
function initPlaceShips() {

    // variables to be used in various places
    var cell;
    var ship;

    // get the next ship to place
    for (i = 0; i < shipsToPlace.length; i++) {
        
        if (!shipsToPlace[i].isPlaced()) {
            ship = shipsToPlace[i];
            break;
        }
    }

    // if there aren't any ships left to place...
    if (ship == undefined) {
        // cleanups
        $("#boardPlayer td").off("mouseenter");
        $("#boardPlayer td").off("click");
        $(window).off("keydown");
        cleanupHoverClasses();
        $("#gameMessage").html("");

        // invoke game ready function
        gameReady();
        return;
    }

    // set the game message to be the name of the ship to place
    $("#gameMessage").html("Place your " + ship.getName());

    // attach a mouseenter event to each cell in the player board
    $("#boardPlayer td").on("mouseenter ", function () {
        // assign the cell variable to the cell hovered on
        cell = $(this);

        // run the hover function on the cell with the ship
        boardPlaceHover(cell, ship);  
    });
    
    // attach a keydown handler to the window
    $(window).keydown(function (e) {

        // when an "r" is pressed...
        if (e.which == 82) {
            // change the orientation of the ship
            ship.changeOrientation();

            // re-run the hover function to show that the ship has changed orientation
            boardPlaceHover(cell, ship);
        }
    });

    // add a mouseleave handler onto the cell in player's board
    $("#boardPlayer td").on ("mouseleave", function () {
        cleanupHoverClasses();
    });

}

// function to cleanup hover classes - removes all hover classes from both boards
function cleanupHoverClasses() {
    $("#boardPlayer td.hover").removeClass("hover");
    $("#boardPlayer td.noHover").removeClass("noHover");
    $("#boardComputer td.hover").removeClass("hover");
    $("#boardComputer td.hover").removeClass("noHover");
}

function removeHovers() {
    $("#boardPlayer td").off("hover");
    $("#boardComputer td").off("hover");
}

// function to hover a ship on the board
function boardPlaceHover($cell, ship) {

    // validation check to make sure the ship has not been placed
    if (ship.isPlaced()) {
        return;
    }

    // validation check to make sure that a cell has been passed
    if ($cell) {

        // make sure all hover classes are removed
        cleanupHoverClasses();
        
        // get the index of the cell to get the x value
        var x = $cell.index();
        // get the row of the cell to get the y value
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // set up variables for canHover and coordinates
        var canPlace, coords;

        // set the variables according to the return values from the Board class method canPlaceship
        [canPlace, coords] = playerBoard.canPlaceShip(ship, x, y);

        // for each coordinate returned from the method...
        for (i = 0; i < coords.length; i++) {
            // set individual coordinate and class for whether the ship can be placed
            var c = coords[i];
            var hover = canPlace ? "hover" : "noHover";

            // validation check to make sure that c is not null
            if (c) {
                // add the relevant class to the player's board
                $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').addClass(hover);
            }
        }

        // if the user can place the ship
        if (canPlace) {
            // remove all click handlers from all cells
            $("#boardPlayer td").off("click");

            // add a click handler to the cell that is being hovered on
            $($cell).one("click", function () {
                boardPlaceShip($cell, ship);
            }); 
        }
    }
}

// function to place a ship on the board
function boardPlaceShip($cell, ship) {

    // validation check to ensure that the ship has not been placed
    if (ship.isPlaced()) {
        return;
    }
    
    // get the index of the cell to get the x value
    var x = $cell.index();
    // get the row of the cell to get the y value
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    // set up variables for canHover and coordinates
    var canPlace, coords;

    // set the variables according to the return values from the Board class method canPlaceship
    [canPlace, coords] = playerBoard.canPlaceShip(ship, x, y);

    // validation check that the ship can be placed on the cell
    if (canPlace) {

        // recurse through the coordinates
        for (i = 0; i < coords.length; i++) {

            // set a variable for the individual coordinate
            var c = coords[i];

            // add the appropriate class to each cell
            var cell = $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')')[0];
            
            $(cell).attr("data-ship", ship.getName());
            $(cell).attr("data-orientation", (ship.getOrientation() == 0 ? "Vertical" : "Horizontal"));
            $(cell).attr("data-ship-part", i);
            $(cell).addClass("containsShip");
        }

        // run the function for the Board class
        playerBoard.placeShip(ship, x, y);

        // cleanups
        $("#boardPlayer td").off("hover");
        cleanupHoverClasses();
        $(window).off("keydown");

        // run the place ship function again for any remaining ships
        initPlaceShips();

        // trigger the mouseenter event to show the next ship (if exists) hover
        $cell.trigger("mouseenter");

        initUndoLastShip();
        initResetBoard();
    }
}

// function when hovering on the opponent's board
function boardFireHover($cell) {

    // if the cell exists
    if ($cell) {

        // remove all hover classes
        cleanupHoverClasses();
        
        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // return a boolean as to whether the user can fire at that cell
        var canFire = computerBoard.canFire(x, y);

        // if they can...
        if (canFire) {
            
            // add hover class to the opponent's board
            $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("hover");

            return true;
        }
    }

    return false;
}

// function to fire at the opponent's board
function boardFireAtOpponent($cell) {

    // if the cell exists
    if ($cell) {

        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // return boolean of whether player has hit a shit
        var hit = computerBoard.fire(x, y);

        // if a ship was hit...
        if (hit) {

            // add a class to the cell so that it knows that it contains a ship
            $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("containsShip");

            // get the coordinate object at the coordinates
            var coord = computerBoard.getObjectAt(x, y);

            // get the ship object at the coordinate
            var ship = coord.getShip();

            // validation check to make sure that the ship exists§
            if (ship) {
                
                // check whether the ship has been destroyed
                if (ship.isDestroyed()) {
                    
                    // add a class to let the remaining ships container know that the ship has been destroyed
                    $("#opponentContainer .remainingShipsContainer li." + ship.getName()).addClass("destroyed");
                }
            }
        }
        
        // let the cell know it has been hit
        $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("hit");
    }
}

// function to invoke when the game is ready to start playing
function gameReady() {
    // cleanups
    $("boardPlayer td").off("mouseenter");
    $("boardPlayer td").off("mouseleave");
    $(window).off("keydown");

    // show the start game button
    $("#startGame").fadeIn(500);
    
    // add click handler to the button at this point
    $("#startGame").off("click").one("click", function () {

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

    $("#resetBoard").fadeOut(500).off("click");
    $("#undoLastShip").fadeOut(500).off("click");

    // place the ships for the AI
    placeAIShips();

    // let the player have the first move
    playerMove();    
}

// function to place AI ships
function placeAIShips() {
    // initialise AI
    AI = new AI("AI", computerBoard, playerBoard);

    // invoke the place ships method
    AI.placeShips();
}

// function for a player making their move
function playerMove() {
    
    // validation check to ensure the game is viable
    if (game.isViable()) {

        // add a mouseenter handler onto the computer's board cells
        $("#boardComputer td").on("mouseenter", function () {

            // initialise cell
            var $cell = $(this);

            // run hover function
            var canFire = boardFireHover($cell);

            // validation to ensure user can fire
            if (canFire) {

                // remove any extra click handlers and add a fresh one
                $cell.off("click").one("click", function () {

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
        });

        // add mouseleave handler to cleanup any hovers
        $("#boardComputer").on ("mouseleave", function () {
            cleanupHoverClasses();
        });
    } else {

        // if game is not viable, end game
        endGame("opponent");
    }
}

// function for the AI making their move
function AIMove() {

    // validation check to ensure game is viable
    if (game.isViable()) {

        // remove handler from computer board so player cannot cheat
        $("#boardComputer td").off("mouseenter").off("mouseleave");

        // ensure all click handlers are removed so user cannot cheat
        $("#boardComputer td").off("click");

        // invoke fire method from AI and return coordinates hit
        var coords = AI.fire();

        // add hit class to coordinate
        $('#boardPlayer tr:eq(' + coords.getY() + ') > td:eq(' + coords.getX() + ')').addClass("hit");

        // get coordinate and ship object
        var coord = playerBoard.getObjectAt(coords.getX(), coords.getY());
        var ship = coord.getShip();

        // validation check to see if coordinate contains a ship
        if (ship) {
            
            // check if ship is destroyed
            if (ship.isDestroyed()) {

                // if ship is destroyed, update remaining ships
                $("#playerContainer .remainingShipsContainer li." + ship.getName()).addClass("destroyed");
            }
        }

        // player's turn
        playerMove();
    } else {

        // if game is not viable, end
        endGame("player");
    }
}

// function to end game - HACK
function endGame(winner) {

    // alert appropriate message
    if (winner == "player") {
        alert("Game Over! - You Won! :)")
    } else {
        alert("Game Over! - You Lost! :(");
    }
}

function initUndoLastShip() {
    if (!$("#undoLastShip:visible").length) {
        $("#undoLastShip").fadeIn(500).off("click").one("click", function () {
            undoLastShip();
        });
    }
}

function undoLastShip() {

    var ship, coords, numShips;
    [ship, coords, numShips] = playerBoard.undoPlaceShip();

    for (var i = 0; i < coords.length; i++) {
        var c = coords[i];
        $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').removeData("ship").removeClass("containsShip");
    }

    initPlaceShips();

    if (numShips > 0) {
        $("#undoLastShip").off("click").one("click", function () {
            undoLastShip();
        });
    } else {
        $("#undoLastShip").fadeOut(500);
        $("#startGame").fadeOut(500);
    }
}

function initResetBoard() {

    if (!$("#resetBoard:visible").length) {
        $("#resetBoard").fadeIn(500).off("click").one("click", function () {
            resetBoard();
        });
    }
}

function resetBoard() {

    $("#resetBoard").fadeOut(500);
    $("#undoLastShip").fadeOut(500);
    $("#startGame").fadeOut(500);

    $("#boardPlayer td").removeClass("containsShip").removeData("ship");

    playerBoard.resetBoard();

    initPlaceShips();
}