/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick                Initial creation
 * V0.11    Nick    01/12/16    should have been calling a different function when the perk ends
 * V0.2     Nick    02/12/16    extracted action to file
 * V0.21    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to initialise the Sonar perk
 */
function initSonarPerk() {

    // remove any existing mouse events from the opponent's board
    $(page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + opponentBoard + " td").unbind("mouseleave");

    // add a mouse event to the board
    $(page + " " + opponentBoard + " td").bind("mouseenter", function (e) {

        //var $cell = $(this);
        var $cell = $(this);

        // remove all hover classes
        cleanupHoverClasses();
        
        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // run the hover function
        sonarPerkHover(x, y);

        // add a click event to the cell
        $cell.off("click").one("click", function () {

            // remove all hover classes
            cleanupHoverClasses();

            // run the sonar action
            sonarAction(x, y);
        });
    });
}

/**
 * @param   {number}    x   the x value
 * @param   {number}    y   the y value
 */
function sonarPerkHover(x, y) {

    // initialise boundaries
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
}