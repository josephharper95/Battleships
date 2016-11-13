/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    13/11/16    initial creation
 * 
 */

/**
 * Set the attributes for images on board
 */
function setShipAttributesOnBoard(board, ship) {

    var coords = ship.getCoordinates();

    // recurse through the coordinates
    for (i = 0; i < coords.length; i++) {

        // set a variable for the individual coordinate
        var c = coords[i];

        // add the appropriate class to each cell
        var cell = $(board + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")")[0];
        
        $(cell).attr("data-ship", ship.getName());
        $(cell).attr("data-orientation", (ship.getOrientation() == 0 ? "Vertical" : "Horizontal"));
        $(cell).attr("data-ship-part", i);

        if (!$(cell).hasClass("containsShip")) {
            $(cell).addClass("containsShip");
        }
    }
}