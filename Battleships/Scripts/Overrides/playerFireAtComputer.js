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

                //setShipAttributesOnBoard(opponentBoard, ship);
                
                // add a class to let the remaining ships container know that the ship has been destroyed
                //$("#opponentContainer " + boardExtras + " ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }
    }
    
    // let the cell know it has been hit
    totalShots++;
    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");
}