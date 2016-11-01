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
BouncingBomb.prototype.action = function(x, y){

    // method variables
    var initialTarget = this.getTarget().getCoordinateAt(x, y);
    var size = this.getTarget().getHeight();

    var row = x;
    var col = y;

    if ((this.getTarget().getCoordinateAt(x, y).containsShip())
    &&(!this.getTarget().getCoordinateAt(x, y).isHit()))
    { // If the given coordinates contain a ship and haven't been hit yet...
        return getCoordinateAt(x, y);
    }
    else
    { // Else.....
        if(y > 0)
        { // take 1 from the y if it is greater than 0 (so the shot travels up the board)
            y = y - 1;
        }
        else if(y == 0)
        { // add 1 to the y if it is 0 (so the shot travels down the board)
            y = y + 1;
        }

        if ((this.getTarget().getCoordinateAt(x, y).containsShip())
        &&(!this.getTarget().getCoordinateAt(x, y).isHit())) 
        { // If the new coordinates contain a ship and haven't been hit yet...
            return getCoordinateAt(x, y);
        }
    }

    // if the bouncing bomb does not hit anything...
    return false;
}
