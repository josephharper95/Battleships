/**
 * 
 * V0.1     Nick    24/12/16    intial creation
 * V0.11    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to override existing function to fire at ship, but NOT show the ship image when sunk
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
    }
    
    // let the cell know it has been hit
    totalShots++;
    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");
}