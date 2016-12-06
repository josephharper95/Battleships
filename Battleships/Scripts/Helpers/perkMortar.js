/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    06/12/16    initial creation
 * 
 */

function initMortarPerk() {

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

        var canUse = mortarPerkHover(x, y);

        if (canUse) {
            
            $cell.unbind("click").bind("click", function () {

                // remove all hover classes
                cleanupHoverClasses();

                mortarAction(x, y);
            });
        } else {
            cleanupHoverClasses();
        }
    });
}

function mortarPerkHover(x, y) {

    var lowX = (x - 1) >= 0 ? true : false;
    var highX = (x + 1) < boardSize ? true : false;
    var lowY = (y - 1) >= 0 ? true : false;
    var highY = (y + 1) < boardSize ? true : false;

    var available = 0;

    // TOP ROW
    if (highY) {

        if (lowX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            available += opponentBoardClass.getCoordinateAt(y + 1, x - 1).isHit() ? 0 : 1;
        }

        $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + x + ")").addClass("hover");
        available += opponentBoardClass.getCoordinateAt(y + 1, x).isHit() ? 0 : 1;
        
        if (highX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y + 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            available += opponentBoardClass.getCoordinateAt(y + 1, x + 1).isHit() ? 0 : 1;
        }

    }

    // MIDDLE ROW
    if (lowX) {
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x - 1) + ")").addClass("hover");
        available += opponentBoardClass.getCoordinateAt(y, x - 1).isHit() ? 0 : 1;
    }

    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");
    available += opponentBoardClass.getCoordinateAt(y, x).isHit() ? 0 : 1;

    if (highX) {
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x + 1) + ")").addClass("hover");
        available += opponentBoardClass.getCoordinateAt(y, x + 1).isHit() ? 0 : 1;
    }

    // BOTTOM ROW
    if (lowY) {

        if (lowX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x - 1) + ")").addClass("hover");
            available += opponentBoardClass.getCoordinateAt(y - 1, x - 1).isHit() ? 0 : 1;
        }

        $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + x + ")").addClass("hover");
        available += opponentBoardClass.getCoordinateAt(y - 1, x).isHit() ? 0 : 1;

        if (highX) {
            $(page + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + (x + 1) + ")").addClass("hover");
            available += opponentBoardClass.getCoordinateAt(y - 1, x + 1).isHit() ? 0 : 1;
        }
    }

    return available >= 3;
}