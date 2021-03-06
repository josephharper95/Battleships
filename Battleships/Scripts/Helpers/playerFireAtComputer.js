/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    Initial creation
 * V0.2     Nick    10/11/16    update to endGame to add param
 * V0.21    Nick    01/12/16    updated variable
 * V0.22    Nick    02/12/16    bug fix
 * V0.23    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to allow player to make a move
 */
function playerMove() {
    
    // validation check to ensure the game is viable
    if (game.isViable()) {

        // add a mouseenter handler onto the computer's board cells
        $(page + " " + opponentBoard + " td").unbind("mouseenter").bind("mouseenter", function () {

            // initialise cell
            var $cell = $(this);

            // run hover function
            var canFire = boardFireHover($cell);

            // validation to ensure user can fire
            if (canFire) {

                // remove any extra click handlers and add a fresh one
                $cell.unbind("click").one("click", function () {

                    // invoke method to fire at opponent
                    boardFireAtOpponent($cell);

                    // cleanups
                    removeHovers();
                    cleanupHoverClasses();

                    // change turn to be AI
                    AIMove();
                });
            } else {
                cleanupHoverClasses();
            }

            // add mouseleave handler to cleanup any hovers
            $cell.unbind("mouseleave").bind("mouseleave", function () {
                cleanupHoverClasses();
            });
        });

        $(".perkContainer .perk.button:not(.disabled)").unbind("click").one("click", function () {
            
            removeHovers();
            disablePerks();

            var perkCell = $(this);
            var perk = $(perkCell).data("perk");

            runPlayerPerk(perk);
        });
    } else {

        // if game is not viable, end game
        endGame("opponent", true);
    }
}

/**
 * Function to handle the firing on the opponent's board if passed a coordinate
 * 
 * @param   {HTMLElement}   $cell   cell to be fired at
 */
function boardFireAtOpponent($cell) {

    // if the cell exists
    if ($cell) {

        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // fire at the coordinate
        boardFireAtOpponentCoordinate(x, y);
    }
}

/**
 * Function to handle the firing on the opponent's board if passed separate coordinates
 * 
 * @param   {number}    x   the x value
 * @param   {number}    y   the y value
 */
function boardFireAtOpponentCoordinate(x, y) {
    // return boolean of whether player has hit a shit
    var hit = opponentBoardClass.fire(x, y);

    // if a ship was hit...
    if (hit) {

        totalHits++;

        // add a class to the cell so that it knows that it contains a ship
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("containsShip");

        // get the coordinate object at the coordinates
        var coord = opponentBoardClass.getCoordinateAt(x, y);

        // get the ship object at the coordinate
        var ship = coord.getShip();

        // validation check to make sure that the ship exists§
        if (ship) {
            
            // check whether the ship has been destroyed
            if (ship.isDestroyed()) {

                // set the ship attributes on the board
                setShipAttributesOnBoard(opponentBoard, ship);
                
                // add a class to let the remaining ships container know that the ship has been destroyed
                $("#opponentContainer " + boardExtras + " ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }
    }
    
    // let the cell know it has been hit
    totalShots++;
    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");
}