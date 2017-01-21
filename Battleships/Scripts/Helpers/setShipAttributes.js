/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    13/11/16    initial creation
 * V0.11    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function to add the correct images of ships to the correct cell
 * 
 * @param   {string}    board   the ID of the board to be placed on
 * @param   {Ship}      ship    the ship that is to be placed
 */
function setShipAttributesOnBoard(board, ship) {

    // get the coordinates that the ship needs to be placed on
    var coords = ship.getCoordinates();

    // recurse through the coordinates
    for (i = 0; i < coords.length; i++) {

        // set a variable for the individual coordinate
        var c = coords[i];

        // add the appropriate class to the cell
        var cell = $(board + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")")[0];
        
        // add the appropriate attributes to the cell
        $(cell).attr("data-ship", ship.getName());
        $(cell).attr("data-orientation", (ship.getOrientation() == 0 ? "Vertical" : "Horizontal"));
        $(cell).attr("data-ship-part", i);

        // if the cell doesn't already contain class, add it
        if (!$(cell).hasClass("containsShip")) {
            $(cell).addClass("containsShip");
        }
    }
}