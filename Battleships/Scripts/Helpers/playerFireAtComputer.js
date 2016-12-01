/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    Initial creation
 * V0.2     Nick    10/11/16    update to endGame to add param
 * V0.21    Nick    01/12/16    updated variable
 * 
 */

/**
 * Function to allow player to make a move
 */
function playerMove() {
    
    // validation check to ensure the game is viable
    if (game.isViable()) {

        // add a mouseenter handler onto the computer's board cells
        $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

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
            $cell.bind("mouseleave", function () {
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
 * Function to handle the firing on the opponent's board
 */
function boardFireAtOpponent($cell) {

    // if the cell exists
    if ($cell) {

        // get x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

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
}