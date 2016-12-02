/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    Initial creation
 * V0.11    Nick    10/11/16    Name of board was fixed when it shouldn't have been
 * V0.12    Nick    11/11/16    returning object instead of array
 * V0.13    Nick    13/11/16    changed ID strings to be variables
 * 
 */

/**
 * Function to add a single click event onto the Undo Last Ship button
 */
function initUndoLastShip() {
    if (!$("#undoLastShip:visible").length) {
        $(undoLastShipButton).fadeIn(500).unbind("click").one("click", function () {
            undoLastShip();
        });
    }
}

/**
 * Function to remove the last ship from the board
 */
function undoLastShip() {

    // var ship, coords, numShips;
    // [ship, coords, numShips] = playerBoardClass.undoPlaceShip();

    var obj = playerBoardClass.undoPlaceShip();

    var ship = obj.ship;
    var coords = obj.coordinates;
    var numShips = obj.numShipsPlaced;

    for (var i = 0; i < coords.length; i++) {
        var c = coords[i];
        var $cell = $(page + " " + playerBoard + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")")
        $cell.removeAttr("data-ship")
        $cell.removeClass("containsShip");
        $cell.removeAttr("data-orientation");
        $cell.removeAttr("data-ship-part");
    }
    
    if (numShips > 0) {
        $(undoLastShipButton).unbind("click").one("click", function () {
            undoLastShip();
        });
    } else {
        $(undoLastShipButton).fadeOut(500);
        $(resetBoardButton).fadeOut(500);
    }

    if (numShips < shipsToPlace.length) {
        $(startGameButton).fadeOut(500);
    }

    initPlaceShips();
}

/**
 * Function to add a single click event onto the Reset Board button
 */
function initResetBoard() {

    if (!$("#resetBoard:visible").length) {
        $(resetBoardButton).fadeIn(500).unbind("click").one("click", function () {
            resetBoard();
        });
    }
}

/**
 * Function to reset the board
 */
function resetBoard() {

    $(resetBoardButton).fadeOut(500);
    $(undoLastShipButton).fadeOut(500);
    $(startGameButton).fadeOut(500);

    $(page + " " + playerBoard + " td").removeClass("containsShip");
    $(page + " " + playerBoard + " td").removeAttr("data-ship");
    $(page + " " + playerBoard + " td").removeAttr("data-orientation");
    $(page + " " + playerBoard + " td").removeAttr("data-ship-part");

    playerBoardClass.resetBoard();

    initPlaceShips();
}