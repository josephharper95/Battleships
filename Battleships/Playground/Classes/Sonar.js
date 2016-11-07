/**
 * Last Modified By: Nick Holdsworth
 * Current Version 0.11
 * 
 * V0.1     Dave    24/10/16    initial creation  
 * V0.11    Nick    29/10/16    slight tweaks from integration with UI
 */

function Sonar(targetBoard){

    var target = targetBoard;

    this.getTarget = function(){
        return target;
    }
}

// Inherit from Perk
Sonar.prototype = Object.create(Perk.prototype);
Sonar.prototype.constructor = Sonar;

/**
 * Checks adjacent locations around a given coordinate and returns the first coordinate that contains a ship
 * @return {coordinate}
 */
Sonar.prototype.action = function(x, y){

    // local variables
    var centre = this.getTarget().getCoordinateAt(x, y);
    var size = this.getTarget().getHeight();

    var row = x;
    var col = y;
    var locations = new Array();

    // recurse through columns
    for (var x = -1; x <= 1; x++) {
        
        // increment by x
        var nextRow = row + x;

        // recurse through each row in column
        for (var y = -1; y <= 1; y++) {

            // increment by y
            var nextCol = col + y;

            // checks
            if (!(nextCol < 0 || nextCol >= size || nextRow < 0 || nextCol >= size)
                &&
                (this.getTarget().getCoordinateAt(nextRow, nextCol).containsShip())
                &&
                (!this.getTarget().getCoordinateAt(nextRow, nextCol).isHit())) {

                locations.push(this.getTarget().getCoordinateAt(nextRow, nextCol));
            }
        }
    }

    // get the amount of locations that have been found
    var count = locations.length;

    // guard clause
    if (count > 0) {
        var rand = Math.floor(Math.random() * count);

        // return a random location from the list
        return locations[rand];
    }

    // if no locations, return false
    return false;
}

