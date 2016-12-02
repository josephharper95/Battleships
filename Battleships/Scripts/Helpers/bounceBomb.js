/**
 * 
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    01/12/16    initial creation
 * 
 */

var bbOrientation = 1;
var bbRotate = "#rotateBounceBomb";

function initBounceBombPerk() {

    $(bbRotate).fadeIn(500);

    $(bbRotate).on("click", function () {
        bbOrientation = bbOrientation == 1 ? 0 : 1;

        console.log(bbOrientation);
    });

    $(page + " " + opponentBoard + " td").unbind("mouseenter");
    $(page + " " + opponentBoard + " td").unbind("mouseleave");

    $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

        var $cell = $(this);

        if ($cell) {
            // x, y vals
            var x = $cell.index();
            var $tr = $cell.closest('tr');
            var y = $tr.index();

            var canUse = bounceBombHover(x, y);

            if (canUse) {

                $cell.unbind("click").one("click", function () {

                    bounceBombAction(x, y, bbOrientation);
                    cleanupHoverClasses();

                    $(bbRotate).fadeOut(500).unbind("click");
                });
            }
        }
    });

    $(page + " " + opponentBoard + " td").bind("mouseleave", function () {
        cleanupHoverClasses();
    });
}

function bounceBombHover(x, y) {

    var canHover1 = false;
    var canHover2 = false;

    // vertical
    if (bbOrientation == 1) {

        // if it is top row and vertical they cannot use BB
        if (y != 0) {
            
            // if the first coordinate has a ship placed
            if (opponentBoardClass.canFire(x, y)) {
                canHover1 = true;
            }

            // if the second coordinate has a ship placed
            if (opponentBoardClass.canFire(x, y - 1)) {
                canHover2 = true;
            }

            if (canHover1 && canHover2) {

                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");
                $(page  + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + x + ")").addClass("hover");

                return true;

            } else {

                var hover1 = canHover1 ? "hover" : "noHover";
                var hover2 = canHover2 ? "hover" : "noHover";

                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
                $(page  + " " + opponentBoard + " tr:eq(" + (y - 1) + ") > td:eq(" + x + ")").addClass("noHover");

                return false;
            }

        } else {
            $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
            return false;
        }

    // horizontal
    } else {

        // if it is last row and horizontal they cannot use BB
        if (x != boardSize - 1) {

            // if the first coordinate has a ship placed
            if (opponentBoardClass.canFire(x, y)) {
                canHover1 = true;
            }

            // if the second coordinate has a ship placed
            if (opponentBoardClass.canFire(x + 1, y)) {
                canHover2 = true;
            }

            if (canHover1 && canHover2) {

                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");
                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x + 1) + ")").addClass("hover");

                return true;

            } else {

                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
                $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + (x + 1) + ")").addClass("noHover");

                return false;
            }

        } else {
            $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("noHover");
            return false;
        }
    }
}