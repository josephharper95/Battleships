/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    07/11/16    Initial creation
 * V0.11    Nick    09/11/16    returning object instead of array
 * 
 */

/**
 * Function to begin the place ships functionality - ITERATIVE
 */
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
        cleanupHoverClasses();
        removeClicks();
        removeHovers();

        $(window).unbind("keydown");
        $("#gameMessage").html("");

        // invoke game ready function
        gameReady();
        return;
    }

    // set the game message to be the name of the ship to place
    $("#gameMessage").html("Place your " + ship.getName());

    // attach a mouseenter event to each cell in the player board
    $(page + " " + playerBoard + " td").bind("mouseenter ", function () {
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
    $(page + " " + playerBoard + " td").on ("mouseleave", function () {
        cleanupHoverClasses();
    });
}

/**
 * Function for user to place their ship on their board
 * 
 * @param   {$cell}     the cell that the first part of the ship is to be placed in
 * @param   {ship}      the ship that is to be placed on the board
 */
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

    var obj = playerBoardClass.canPlaceShip(ship, x, y);
    
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

        setShipAttributesOnBoard(playerBoard, ship);

        // run the place ship function again for any remaining ships
        initPlaceShips();

        // trigger the mouseenter event to show the next ship (if exists) hover
        $cell.trigger("mouseenter");

        initUndoLastShip();
        initResetBoard();
    }
}