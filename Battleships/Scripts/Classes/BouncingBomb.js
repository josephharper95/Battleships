/**
 * Last Modified By: Joe Harper
 * Current Version 0.1
 * 
 * V0.1     Joe     01/11/16    initial creation  
 * V0.11    Joe     01/12/16    modified return values to 1 and 2
 * V0.12    Nick    21/01/17    final comments added
 * 
 */

/**
 * Constructor for the Bouncing Bomb
 * 
 * @param   {Board} targetBoard the board that the perk is being run one
 */
function BouncingBomb(targetBoard) {

    var target = targetBoard;

    /**
     * Accessor method to return target
     * 
     * @return  {Board} the target board
     */
    this.getTarget = function() {
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
 * 
 * @param   {number}    x           the x value
 * @param   {number}    y           the y value
 * @param   {number}    orientation the orientation
 * 
 * @return  {number}                the number of coordinates to hit
 */
BouncingBomb.prototype.action = function(x, y, orientation) {

    if (typeof(x)!='number' || typeof(y)!= 'number') {
        return false;
    }
    
    // fixed
    return 2;
}
