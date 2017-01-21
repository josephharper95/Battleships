/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    06/12/16    initial creation
 * V0.2     Nick    07/12/16    updated validation bug
 * V0.21    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function called to initialise the mortar perk
 */
function initMortarPerk() {

    // remove any existing mouse events
    $(page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + opponentBoard + " td").unbind("mouseleave");

    // add a new mouse handler
    $(page + " " + opponentBoard + " td").bind("mouseenter", function (e) {

        //var $cell = $(this);
        var $cell = $(this);

        // remove all hover classes
        cleanupHoverClasses();
        
        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // check whether it can use the mortar perk for these coordinates
        var canUse = mortarPerkHover(x, y);

        // if it can use it
        if (canUse) {
            
            // remove any click handlers for the cell, and add a new one
            $cell.unbind("click").bind("click", function () {

                // remove all hover classes
                cleanupHoverClasses();

                // run the mortar action
                mortarAction(x, y);
            });
        } else {

            // if it can't run the action, remove the classes
            cleanupHoverClasses();
        }
    });
}

/**
 * Function to see whether the mortar could be run on the given coordinates
 * 
 * @param   {number}    x   the x value
 * @param   {number}    y   the y value
 * 
 * @returns {boolean}       whether it can hover or not
 */
function mortarPerkHover(x, y) {

    // works out the boundaries
    var lowX = (x - 1) >= 0 ? true : false;
    var highX = (x + 1) < boardSize ? true : false;
    var lowY = (y - 1) >= 0 ? true : false;
    var highY = (y + 1) < boardSize ? true : false;

    // set the number of available moves to 0
    var available = 0;

    // TOP ROW
    if (highY) {

        if (lowX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            
            var isHit = opponentBoardClass.getCoordinateAt((x - 1), (y + 1)).isHit();
            available += isHit ? 0 : 1;
        }

        $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + x + ")").addClass("hover");
        
        var isHit = opponentBoardClass.getCoordinateAt(x, (y + 1)).isHit();
        available += isHit ? 0 : 1;
        
        if (highX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            
            var isHit = opponentBoardClass.getCoordinateAt((x + 1), (y + 1)).isHit();
            available += isHit ? 0 : 1;
        }

    }

    // MIDDLE ROW
    if (lowX) {
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x - 1) + ")").addClass("hover");
        
        var isHit = opponentBoardClass.getCoordinateAt((x - 1), y).isHit();
        available += isHit ? 0 : 1;
    }

    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");
        
    var isHit = opponentBoardClass.getCoordinateAt(x, y).isHit();
    available += isHit ? 0 : 1;

    if (highX) {
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x + 1) + ")").addClass("hover");
        
        var isHit = opponentBoardClass.getCoordinateAt((x + 1), y).isHit();
        available += isHit ? 0 : 1;
    }

    // BOTTOM ROW
    if (lowY) {

        if (lowX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            
            var isHit = opponentBoardClass.getCoordinateAt((x - 1), (y - 1)).isHit();
            available += isHit ? 0 : 1;
        }

        $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + x + ")").addClass("hover");
        
        var isHit = opponentBoardClass.getCoordinateAt(x, (y - 1)).isHit();
        available += isHit ? 0 : 1;

        if (highX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            
            var isHit = opponentBoardClass.getCoordinateAt((x + 1), (y - 1)).isHit();
            available += isHit ? 0 : 1;
        }
    }

    return available >= 3;
}