/**
 * Last Modified By: Joe Harper
 * Current Version 0.1
 * 
 * V0.1     Joe    01/11/16    initial creation  
 */

function BouncingBomb(targetBoard)
{

    var target = targetBoard;

    this.getTarget = function()
    {
        return target;
    }
}

// From parent Perk
BouncingBomb.prototype = Object.create(Perk.prototype);
BouncingBomb.prototype.constructor = BouncingBomb;

/**
 * Takes the given shot coordinate, checks if it contains a ship, if it does, return the coordinate. 
 * If it does not contain a ship, add one to the y axis, check again, Return new coordinate if a ship is found.
 * If no ship is found, return false.
 * @return {coordinate}
 */
BouncingBomb.prototype.action = function(x, y, orientation){

    // method variables
    var row = x;
    var col = y;

    if ((this.getTarget().getCoordinateAt(row, col).containsShip())
    &&(!this.getTarget().getCoordinateAt(row, col).isHit()))
    { // If the given coordinates contain a ship and haven't been hit yet...
        return getCoordinateAt(row, col); // Use the returned coordinate to fire upon....
    }
    
    if(orientation == 1)
    { // If the orientation of the shot is vertical
        col = col + 1;

        if ((this.getTarget().getCoordinateAt(row, col).containsShip())
        &&(!this.getTarget().getCoordinateAt(row, col).isHit())) 
        { // If the new coordinates contain a ship and haven't been hit yet...
            return getCoordinateAt(row, col); // Use the returned coordinate to fire upon....
        }
    }
    else if (orientation == 0)
    { // If the orientation of the shot is horizontal
        row = row + 1;

        if ((this.getTarget().getCoordinateAt(row, col).containsShip())
        &&(!this.getTarget().getCoordinateAt(row, col).isHit())) 
        { // If the new coordinates contain a ship and haven't been hit yet...
            return getCoordinateAt(row, col); // Use the returned coordinate to fire upon....
        }
    }

    // if the bouncing bomb does not hit anything...
    return false;
}
