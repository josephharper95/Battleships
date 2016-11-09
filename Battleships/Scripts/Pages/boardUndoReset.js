/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    Initial creation
 * V0.11    Nick    Name of board was fixed when it shouldn't have been
 * V0.12    Nick    returning object instead of array
 * 
 */

/**
 * Function to add a single click event onto the Undo Last Ship button
 */
function initUndoLastShip() {
    if (!$("#undoLastShip:visible").length) {
        $("#undoLastShip").fadeIn(500).unbind("click").one("click", function () {
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

    initPlaceShips();

    if (numShips > 0) {
        $("#undoLastShip").unbind("click").one("click", function () {
            undoLastShip();
        });
    } else {
        $("#undoLastShip").fadeOut(500);
        $("#resetBoard").fadeOut(500);
        $("#startGame").fadeOut(500);
    }
}

/**
 * Function to add a single click event onto the Reset Board button
 */
function initResetBoard() {

    if (!$("#resetBoard:visible").length) {
        $("#resetBoard").fadeIn(500).unbind("click").one("click", function () {
            resetBoard();
        });
    }
}

/**
 * Function to reset the board
 */
function resetBoard() {

    $("#resetBoard").fadeOut(500);
    $("#undoLastShip").fadeOut(500);
    $("#startGame").fadeOut(500);

    $(page + " " + playerBoard + " td").removeClass("containsShip");
    $(page + " " + playerBoard + " td").removeAttr("data-ship");
    $(page + " " + playerBoard + " td").removeAttr("data-orientation");
    $(page + " " + playerBoard + " td").removeAttr("data-ship-part");

    playerBoardClass.resetBoard();

    initPlaceShips();
}