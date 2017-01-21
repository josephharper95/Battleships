/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    01/12/16    initial creation
 * V0.2     Nick    02/12/16    implementation
 * V0.3     Nick    19/01/17    refactored and final comments
 * 
 */

// set the default values for bounce bomb
var bbOrientation = 1;
var bbRotate = "#rotateBounceBomb";

/**
 * Function to initialise the Bounce Bomb perk
 */
function initBounceBombPerk() {

    // show the rotation button
    $(bbRotate).fadeIn(500);

    // add a click handler to the rotate button
    $(bbRotate).off("click").on("click", function () {

        // swap the rotation around
        bbOrientation = bbOrientation == 1 ? 0 : 1;
    });

    // unbind any existing mouse events
    $(page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + opponentBoard + " td").unbind("mouseleave");

    // attach a mouse event to the board
    $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

        // set the current cell to a variable
        var $cell = $(this);

        // validation check
        if ($cell) {

            // x, y vals
            var x = $cell.index();
            var $tr = $cell.closest('tr');
            var y = $tr.index();

            // check if the bounce bomb can be used on that cell
            var canUse = bounceBombHover(x, y);

            // if it can use the perk
            if (canUse) {

                // remove any pre-existing click handlers, and add a click handler
                $cell.unbind("click").one("click", function () {

                    // run the action
                    bounceBombAction(x, y, bbOrientation);

                    // cleanup any hovers
                    cleanupHoverClasses();

                    // hide the rotate button and remove click handler
                    $(bbRotate).fadeOut(500).unbind("click");
                });
            }
        }
    });

    // rebind the existing mouseleave function to remove hover classes
    $(page + " " + opponentBoard + " td").bind("mouseleave", function () {
        cleanupHoverClasses();
    });
}

/**
 * Function to see whether the cell hovered on can be used for the Bounce Bomb
 * 
 * @param   {number}    x   x value
 * @param   {number}    y   y value
 * 
 * @returns {boolean}       whether the cell can be hovered on
 */
function bounceBombHover(x, y) {

    // initialise both fields to be negative
    var canHover1 = false;
    var canHover2 = false;

    // vertical
    // if (bbOrientation == 1) {

    var secondX = bbOrientation == 1 ? x : x + 1;
    var secondY = bbOrientation == 0 ? y : y - 1;

    // check the boundaries
    if ((bbOrientation == 1 && y == 0) || 
        (bbOrientation == 0 && x == boardSize - 1)) {

        // show user they cannot hover and return false
        $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
        return false;
    }
        
    // if the first coordinate has a ship placed
    if (opponentBoardClass.canFire(x, y)) {
        canHover1 = true;
    }

    // if the second coordinate has a ship placed
    if (opponentBoardClass.canFire(secondX, secondY)) {
        canHover2 = true;
    }

    // check that both can hover
    if (canHover1 && canHover2) {

        // add hover class
        $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");
        $(page  + " " + opponentBoard + " tr:eq(" + (secondY) + ") > td:eq(" + secondX + ")").addClass("hover");

        return true;

    } else {

        // add no hover class
        $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
        $(page  + " " + opponentBoard + " tr:eq(" + (secondY) + ") > td:eq(" + secondX + ")").addClass("noHover");

        return false;
    }
}