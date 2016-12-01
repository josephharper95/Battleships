/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick                Initial creation
 * V0.11    Nick                Added extra param to end game
 * V0.12    Nick    01/12/16    update to variable name
 * 
 */

/**
 * Function to allow AI to make a move
 */
function AIMove() {

    // validation check to ensure game is viable
    if (game.isViable()) {

        // remove handler from computer board so player cannot cheat
        $(page + " " + opponentBoard + " td").unbind("mouseenter").unbind("mouseleave");

        // ensure all click handlers are removed so user cannot cheat
        $(page + " " + opponentBoard + " td").unbind("click");

        // invoke fire method from AI and return coordinates hit
        var coords = AI.fire();

        // add hit class to coordinate
        $(page + " " + playerBoard + " tr:eq(" + coords.getY() + ") > td:eq(" + coords.getX() + ")").addClass("hit");

        // get coordinate and ship object
        var coord = playerBoardClass.getCoordinateAt(coords.getX(), coords.getY());
        var ship = coord.getShip();

        // validation check to see if coordinate contains a ship
        if (ship) {

            totalHitsReceived++;
            
            // check if ship is destroyed
            if (ship.isDestroyed()) {

                // if ship is destroyed, update remaining ships
                $("#playerContainer " + boardExtras + " ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }

        // player's turn
        playerMove();
    } else {

        // if game is not viable, end
        endGame("player", true);
    }
}