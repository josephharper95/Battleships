/**
*
* Last Modified By: Dave MacDonald
*
* V0.1      Dave    24/10/2016       
*
**/

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
    var centre = this.getTarget().getCoordinateAt(x, y);
    var size = this.getTarget().getHeight();

    //Calc coords 

    var row = centre.getX();
    var col = centre.getY();
    var locations = new Array();
    for(var x = -1; x <= 1; x++) 
    {
        var nextRow = row + x;
        for(var y = -1; y <= 1; y++) 
        {
            var nextCol = col + y;
            if(nextCol<0 || nextCol >= size || nextRow < 0 || nextCol >=size){
                break;
            }
            if(!this.getTarget().getCoordinateAt(nextRow, nextCol).containsShip()){
                break;
            }
            locations.push(this.getTarget().getCoordinateAt(nextRow, nextCol));
            }
    }
    return locations[0];
}

