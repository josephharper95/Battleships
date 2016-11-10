/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    Initial creation
 * V0.11    Nick    returning object instead of array
 * V0.2     Nick    update for new rotation functionality
 * 
 */

/**
 * Function to hover on the player board when trying to place a ship
 * 
 * @param   {hoverCell}     The table cell that the mouse is hovering on
 * @param   {ship}      The ship that is currently trying to be placed on the ship  
 */

var hoverCell;

function boardPlaceHover(ship) {

    console.log("hover");
    console.log(hoverCell);

    // validation check to make sure the ship has not been placed
    if (ship.isPlaced()) {
        return;
    }

    // validation check to make sure that a cell has been passed
    if (hoverCell) {

        // make sure all hover classes are removed
        cleanupHoverClasses();
        
        // get the index of the cell to get the x value
        var x = hoverCell.index();
        // get the row of the cell to get the y value
        var $tr = hoverCell.closest('tr');
        var y = $tr.index();

        var obj = playerBoardClass.canPlaceShip(ship, x, y);
    
        var canPlace = obj.canPlace;
        var coords = obj.coordinates;

        // for each coordinate returned from the method...
        for (i = 0; i < coords.length; i++) {
            // set individual coordinate and class for whether the ship can be placed
            var c = coords[i];
            var hover = canPlace ? "hover" : "noHover";

            // validation check to make sure that c is not null
            if (c) {
                // add the relevant class to the player's board
                $(page + " " + playerBoard + " tr:eq(" + c.getY() + ") > td:eq(" + c.getX() + ")").addClass(hover);
            }
        }

        // if the user can place the ship
        if (canPlace) {
            // remove all click handlers from all cells
            $(page + " " + playerBoard + " td").unbind("click");

            // add a click handler to the cell that is being hovered on
            $(hoverCell).one("click", function () {
                boardPlaceShip(hoverCell, ship);
            }); 
        }
    }
}

/**
 * Function to hover on the opponent's board when trying to fire
 * 
 * @param   {hoverCell}     The table cell that the mouse is hovering on
 * 
 * @returns {boolean}   Whether the board can be fired on
 */
function boardFireHover(hoverCell) {

    // if the cell exists
    if (hoverCell) {

        // remove all hover classes
        cleanupHoverClasses();
        
        // get x and y values
        var x = hoverCell.index();
        var $tr = hoverCell.closest('tr');
        var y = $tr.index();

        // return a boolean as to whether the user can fire at that cell
        var canFire = opponentBoardClass.canFire(x, y);

        // if they can...
        if (canFire) {
            
            // add hover class to the opponent's board
            $(page  + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hover");

            return true;
        }
    }

    return false;
}