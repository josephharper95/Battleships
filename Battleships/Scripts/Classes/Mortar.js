/**
 * 
 * V0.1     Dave    03/12/16    initial creation  
 */

function Mortar(targetBoard){

    var target = targetBoard;

    this.getTarget = function(){
        return target;
    }
}

// Inherit from Perk
Mortar.prototype = Object.create(Perk.prototype);
Mortar.prototype.constructor = Mortar;

/**
 * Fires 3 random shots on adjacent locations to the given coordinate.
 * @return {Array[coordinate]}
 */
Mortar.prototype.action = function(x, y){

    if(typeof(x)!='number' || typeof(y)!= 'number')
    {
        return false;
    }

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
                (!this.getTarget().getCoordinateAt(nextRow, nextCol).isHit())) {

                locations.push(this.getTarget().getCoordinateAt(nextRow, nextCol));
            }
        }
    }

    // get the amount of locations that have been found
    var count = locations.length;

    
    // guard clause
    if (count > 0) {
       shots = new Array();
       //Find 3 shots at random from the given locations.
        while(shots.length < 3 && count > 0){
            var shot = Math.floor(Math.random() * count);
            shots.push(locations[shot]);
            locations.splice(shot, 1);
            count--;
        }
        return shots;
    }

    // if no locations, return false
    return false;
}

