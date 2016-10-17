/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.25
*
* V0.1      Dave / Nick / Joe   01/10/16    initial creation
* V0.11     Dave                05/10/16    Added comments
* V0.2      Dave                06/10/16    Added undoPlaceShip method.
* V0.21     Dave                07/10/16    updated bugs with undoPlaceShip and made resetBoard more efficient
* V0.22     Nick                07/10/16    updated undoPlaceShip & resetBoard to return values for UI
* V0.23     Dave                13/10/16    updated adjacentLocationsMethod to fix out of bounds coordinate issue
* V0.24     Dave                17/10/16    Changed remainingShips so it now returns an array
* V0.25     Nick                17/10/16    made place ships more efficient using coords from canPlaceShips - reformatted file with header comments
*
**/

function Board(size) {
    var _ships = new Array();
    var _coordinates = new Array(_height);
    var _height = size;
    var _width = size;
    const MAX_SHIPS = 5;
    var _shipsPlaced = [];

    // Create multidimensional array and initialise a new coordinate object for each cell.

    for (var h = 0; h < _height; h++) {
        _coordinates[h] = new Array(_width);

        for (var w = 0; w < _width; w++) {
            _coordinates[h][w] = new Coordinate(h, w);
        }
    }

/******************************
 * 
 *      PLACING SHIPS
 * 
******************************/

    /**
     * Function to place validate ship placement
     * @param {ship} a ship object
     * @param {number} an x coordinate
     * @param {number} a y coordinate 
     * 
     * @return {boolean} whether or not the placement is valid
     * @return {Coordinate[]} the list of coordinates that it can / cannot be placed on
     */
    this.canPlaceShip = function(ship, x, y) {

        var orientation = ship.getOrientation();
        var shipSize = ship.getSize();
        var x = x;
        var y = y;
        var coordinates = new Array(shipSize);
        var passed = true;

        if (ship.isPlaced()) {
            return [false, new Array()];
        }

        for (i = 0; i < shipSize; i++) {
            
            if (x > _width - 1 || x < 0 || y > _height - 1 || y < 0) {
                return [false, coordinates];
            }

            var coordinate = _coordinates[x][y];
            coordinates[i] = coordinate;

            if (coordinate.containsShip()) {
                //return [false, coordinates];
                passed = false;
            }

            if (orientation == 0){
                y++;
            } else {
                x++;
            }
        }
        
        return [passed, coordinates];
    }

    /**
     * Function to place a ship on the Board
     * @param {ship} a ship object
     * @param {number} an x coordinate
     * @param {number} a y coordinate 
     * 
     * @return {boolean} whether or not the placement was successful
     */
    this.placeShip = function(ship, x, y) {

        var canPlace, coords;
        [canPlace, coords] = this.canPlaceShip(ship, x, y);

        if (canPlace) {

            for (i = 0; i < coords.length; i++) {

                var coordinate = coords[i];
                coordinate.placeShip(ship);
            }

            ship.place(coords);
            _ships.push(ship);
            _shipsPlaced.push(ship);
            return true;

        } else {
            return false;
        }
    }

    /**
     * Function to undo the last ship placement.
     */
    this.undoPlaceShip = function(){
        var ship = _shipsPlaced.pop();
        var coords = ship.coordinates();
        for(var i = 0; i< ship.getSize(); i++){
            coords[i].removeShip();
        }
        ship.reset();

        return [ship, coords, _shipsPlaced.length];
    }

    /**
     * Re-initialise the board and all Coordinate objects.
     */
    this.resetBoard = function() {
        
        while(_shipsPlaced.length > 0) {
            this.undoPlaceShip();
        }
    }

/******************************
 * 
 *      FIRING AT SHIPS
 * 
******************************/    

    /**
     * Checks to see if a location is already hit
     * @param {number} x value
     * @param {number} y value
     * 
     * @return {boolean} whether or not the coordinate is hit
     */
    this.canFire = function (x, y) {
        var coordinate = _coordinates[x][y];
        
        return !coordinate.isHit();
    }

    /**
     * Fires at a given coordinate
     * @param {number} x value
     * @param {number} y value
     * 
     * @return
     */
    this.fire = function(x, y) {
        if (this.canFire) {

            var coordinate = _coordinates[x][y];

            var hit = coordinate.recordHit();

            return hit;
        }

        return false;
    }

/******************************
 * 
 *     ADJACENT LOCATIONS
 * 
******************************/  

    /**
     * Gets the adjacent locations for a given coordinate, ignoring diagonals and out of bounds
     * @param {number} x value
     * @param {number} y value
     * 
     * @return {Coordinate[]} array of coordinate objects.
     */
    this.getAdjacentLocations = function(x, y) {
        var locations = new Array();

        if (y - 1 >= 0) {
            locations.push(this.getObjectAt(x, y-1)); //9, 4
        }

        if (y + 1 < _height) {
            locations.push(this.getObjectAt(x, y+1)); //9, 6
        }

        if (x - 1 >= 0) {
            locations.push(this.getObjectAt(x-1, y)); //7,5
        }

        if (x + 1 < _width) {
            locations.push(this.getObjectAt(x+1, y)); //
        }

        return locations;   
    }

    /**
     * Queries the adjacent locations for valid moves
     * @param {number} x value
     * @param {number} y value
     * 
     * @return {Coordinate[]} array of coordinate objects.
     */
    this.getMovesAtAdjacentLocations = function(x, y) {
        var locations = this.getAdjacentLocations(x, y);
        var availMoveLocations = new Array();

        for (i = 0; i < locations.length; i++) {
            if (!locations[i].isHit()) {
                availMoveLocations.push(locations[i]);
            }
        }
        //Shuffle
        var j, x, i;
        for (i = availMoveLocations.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = availMoveLocations[i - 1];
            availMoveLocations[i - 1] = availMoveLocations[j];
            availMoveLocations[j] = x;
        }

        return availMoveLocations;
    }

/******************************
 * 
 *      ACCESSOR METHODS
 * 
******************************/  

    /**
     * Returns the object at a given coordinate
     * @param {number} x value
     * @param {number} y value
     * 
     * @return {Coordinate} the coordinate object.
     */
    this.getObjectAt = function(x, y) {
        return _coordinates[x][y];
    }

    /**
     * Returns the ships array
     */
    this.remainingShips = function() {
         return _ships;
    }

    /**
     * Checks to see whether the game is finished
     * 
     * @return {boolean}
     */
    this.isViable = function(){
        var result = 0;
        for(var i = 0; i < _ships.length; i++){
            if(!_ships[i].isDestroyed()){
                result += 1;
            }
        }
        if (result != 0){
            return true;
        } else {
            return false;
        }
    }

    /**
     * Overriden toString method for testing purposes.
     * 
     * @return {string}
     */
    this.toString = function(){
        document.write("<table border='1' width='400' height='400' style='table-layout: fixed'>");
        for(var i = 0; i < _coordinates.length; i++){
                document.write("<tr>");
            for(var j=0; j<_coordinates[i].length; j++){
                if(_coordinates[i][j].isHit()){
                    document.write("<td bgcolor='#FF0000'>");
                } else{
                    document.write("<td>");
                }
                if(_coordinates[i][j].containsShip()){
                    var temp = _coordinates[i][j].getShip().getName();
                    document.write(temp.substring(0,1));
                }
                else{
                    document.write(".");
                }
                document.write("</td>");
            }
            document.write("</tr>");
        }
        document.write("</table>");
    }

    /**
     * Returns the coordinate multidimensional array as a list.
     * 
     * @return {Coordinate[]} array of coordinate objects.
     */
    this.getListOfCoordinates = function(){
        var list = new Array();
        for (var h = 0; h < _height; h++) {
            for (var w = 0; w < _width; w++) {
                list.push(_coordinates[h][w]);
            }

        }
        return list;
    }

    /**
     * Returns the coordinates as a multidimensional array
     * 
     */
    this.getCoordinates = function(){
        return _coordinates;
    }
}