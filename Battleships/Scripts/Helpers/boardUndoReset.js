/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    Initial creation
 * V0.11    Nick    10/11/16    Name of board was fixed when it shouldn't have been
 * V0.12    Nick    11/11/16    returning object instead of array
 * V0.13    Nick    13/11/16    changed ID strings to be variables
 * V0.14    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to add a single click event onto the Undo Last Ship button if it hasn't been already
 */
function initUndoLastShip() {

    // if the undo ship button is not already visible
    if (!$("#undoLastShip:visible").length) {

        // show the undo button and add a click handler
        $(undoLastShipButton).fadeIn(500).unbind("click").one("click", function () {
            undoLastShip();
        });
    }
}

/**
 * Function to remove the last ship from the board
 */
function undoLastShip() {

    // get the details of the ship that has been removed
    var obj = playerBoardClass.undoPlaceShip();

    // set the attributes to their own variables
    var ship = obj.ship;
    var coords = obj.coordinates;
    var numShips = obj.numShipsPlaced;

    // iterate through the ship's coordinates
    for (var i = 0; i < coords.length; i++) {

        // get the individual cell
        var c = coords[i];

        // get the HTML object that the coordinate represents
        var $cell = $(page + " " + playerBoard + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")");

        // remove all attributes and classes from the table cell
        $cell.removeAttr("data-ship");
        $cell.removeClass("containsShip");
        $cell.removeAttr("data-orientation");
        $cell.removeAttr("data-ship-part");
    }
    
    // if there is at least 1 ship left on the board
    if (numShips > 0) {

        // add another click handler on
        $(undoLastShipButton).unbind("click").one("click", function () {
            undoLastShip();
        });

    // if there aren't any ships left
    } else {

        // removed buttons
        $(undoLastShipButton).fadeOut(500);
        $(resetBoardButton).fadeOut(500);
    }

    // if all ships have not been placed (should always be the case)
    if (numShips < shipsToPlace.length) {

        // fade out the start game button
        $(startGameButton).fadeOut(500);
    }

    // run the function to allow a user to place a ship
    initPlaceShips();
}

/**
 * Function to add a single click event onto the Reset Board button
 */
function initResetBoard() {

    // if the reset board button isn't already visible
    if (!$("#resetBoard:visible").length) {

        // show the reset button and add a click handler
        $(resetBoardButton).fadeIn(500).unbind("click").one("click", function () {
            resetBoard();
        });
    }
}

/**
 * Function to reset the board
 */
function resetBoard() {

    // hide all buttons
    $(resetBoardButton).fadeOut(500);
    $(undoLastShipButton).fadeOut(500);
    $(startGameButton).fadeOut(500);

    // remove all attributes and classes
    $(page + " " + playerBoard + " td").removeClass("containsShip");
    $(page + " " + playerBoard + " td").removeAttr("data-ship");
    $(page + " " + playerBoard + " td").removeAttr("data-orientation");
    $(page + " " + playerBoard + " td").removeAttr("data-ship-part");

    // run the reset board on the class to clear it
    playerBoardClass.resetBoard();

    // allow users to place a ship
    initPlaceShips();
}