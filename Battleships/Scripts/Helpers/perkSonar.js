/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick                Initial creation
 * V0.11    Nick    01/12/16    should have been calling a different function when the perk ends
 * 
 */

function initSonarPerk() {

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

        sonarPerkHover(x, y);

        //if (canFire) {
            
        $cell.off("click").one("click", function () {

            // remove all hover classes
            cleanupHoverClasses();

            var sonar = new Sonar(opponentBoardClass);

            var cell = sonar.action(x, y);

            if (cell) {

                $(page + " " + opponentBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");

            } else {
                alert("no moves found :(");
            }

            // allow player to now make a move
            endPlayerPerk();
        });
        //}
    });
}

function sonarPerkHover(x, y) {

    //var canFire = computerBoard.canFire(x, y);

    //if (canFire) {

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
        
        //return true;
    //}

    //return false;
}