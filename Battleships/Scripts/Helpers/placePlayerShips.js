/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    07/11/16    Initial creation
 * V0.11    Nick    09/11/16    returning object instead of array
 * V0.2     Nick    10/11/16    removed rotation code
 * V0.21    Nick    13/11/16    renamed 'gameReady' to 'shipsPlaced'
 * V0.22    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to begin the place ships functionality - ITERATIVE
 */
function initPlaceShips() {

    // variables to be used in various places
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
        cleanupHoverClasses();
        removeClicks();
        removeHovers();

        endShipRotation();
        $("#gameMessage").html("");

        // invoke game ready function
        shipsPlaced();
        return;
    }

    // set the game message to be the name of the ship to place
    $("#gameMessage").html("Place your " + ship.getName());

    // attach a mouseenter event to each cell in the player board
    $(page + " " + playerBoard + " td").bind("mouseenter ", function () {

        // assign the cell variable to the cell hovered on
        hoverCell = $(this);

        // run the hover function on the cell with the ship
        boardPlaceHover(ship);
    });

    initShipRotation(ship);

    // add a mouseleave handler onto the cell in player's board
    $(page + " " + playerBoard + " td").on ("mouseleave", function () {
        hoverCell = null;
        cleanupHoverClasses();
    });
}

/**
 * Function for user to place their ship on their board
 * 
 * @param   {HTMLElement}   $cell   cell that the first part of the ship is to be placed in
 * @param   {Ship}          ship    the ship that is to be placed on the board
 */
function boardPlaceShip($cell, ship) {

    // validation check to ensure that the ship has not been placed
    if (ship.isPlaced()) {
        return;
    }
    
    // get the x and y values
    var x = $cell.index();
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    // get the object to see if a ship can be placed
    var obj = playerBoardClass.canPlaceShip(ship, x, y);
    
    // put the object attributes to variables
    var canPlace = obj.canPlace;
    var coords = obj.coordinates;

    // validation check that the ship can be placed on the cell
    if (canPlace) {

        // run the function for the Board class
        playerBoardClass.placeShip(ship, x, y);

        // cleanups
        $(page + " " + playerBoard + " td").unbind("hover");
        cleanupHoverClasses();
        $(window).unbind("keydown");

        // set the ship attributes onto the board
        setShipAttributesOnBoard(playerBoard, ship);

        // run the place ship function again for any remaining ships
        initPlaceShips();

        // trigger the mouseenter event to show the next ship (if exists) hover
        $cell.trigger("mouseenter");

        // allow the users to undo ship / reset board
        initUndoLastShip();
        initResetBoard();
    }
}