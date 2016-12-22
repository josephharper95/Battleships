/**
*
* Last Modified By: Dave MacDonald
*
* V0.1      Dave / Nick / Joe   01/10/16    initial creation
* V0.11     Dave                05/10/16    Added comments
* V0.2      Dave                06/10/16    Added undoPlaceShip method.
* V0.21     Dave                07/10/16    updated bugs with undoPlaceShip and made resetBoard more efficient
* V0.22     Nick                07/10/16    updated undoPlaceShip & resetBoard to return values for UI
* V0.23     Dave                13/10/16    updated adjacentLocationsMethod to fix out of bounds coordinate issue
* V0.24     Dave                17/10/16    Changed remainingShips so it now returns an array
* V0.25     Nick                17/10/16    made place ships more efficient using coords from canPlaceShips - reformatted file with header comments
* V0.26     Nick                18/10/16    added method "floatingShips" as remainingShips already exists
* V0.27     Dave                21/10/16    refactored code to use prototype pattern, renamed some methods.
* V0.28     Joe                 26/10/16    renamed methods
* V0.29     Nick                09/11/16    returning objects instead of arrays
* V0.30     Nick                17/11/16    fixed bug in get floating ships
* V0.30     Dave                22/11/16    added further validation and exeptions
* V0.31     Dave                13/12/16    added method to move ship
* V0.32     Dave                22/12/16    added healShipCoord method
*
**/

function Board(size) {
    var _height = size;
    var _width = size;
    
    var _ships = new Array();
    var _coordinates = new Array(_height);
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
     *      ACCESSOR METHODS
     * 
    ******************************/  

    this.getShips = function(){
        return _ships;
    }

    this.getCoordinates = function(){
        return _coordinates;
    }

    this.getWidth = function(){
        return _width;
    }

    this.getHeight = function(){
        return _height;
    }

    /**
     * Returns the object at a given coordinate
     * @param {number} x value
     * @param {number} y value
     * 
     * @return {Coordinate} the coordinate object.
     */
    this.getCoordinateAt = function(x, y){
        return _coordinates[x][y];
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

    this.getShipsPlaced = function(){
        return _shipsPlaced;
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
Board.prototype.canPlaceShip = function(ship, x, y) {

    if(typeof(x)!='number' || typeof(y)!= 'number'){
        return false;
    }
    if(typeof(ship)!='object'){
        return false;
    }

    var orientation = ship.getOrientation();
    var shipSize = ship.getSize();
    var coordinates = new Array();
    var passed = true;

    if (ship.isPlaced()) {

        return {
            canPlace: false,
            coordinates: new Array()
        };

        //return [false, new Array()];
    }

    for (i = 0; i < shipSize; i++) {
        
        if (x > this.getWidth() - 1 || x < 0 || y > this.getHeight() - 1 || y < 0) {
            
            return {
                canPlace: false,
                coordinates: coordinates
            };

            //return [false, coordinates];
        }

        var coordinate = this.getCoordinateAt(x, y);
        coordinates.push(coordinate);

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
    
    //return [passed, coordinates];

    return {
        canPlace: passed,
        coordinates: coordinates
    };
}

/**
 * Function to place a ship on the Board
 * @param {ship} a ship object
 * @param {number} an x coordinate
 * @param {number} a y coordinate 
 * 
 * @return {boolean} whether or not the placement was successful
 */
Board.prototype.placeShip = function(ship, x, y) {

    var obj = this.canPlaceShip(ship, x, y);
    
    var canPlace = obj.canPlace;
    var coords = obj.coordinates;

    if (canPlace) {
        for (i = 0; i < coords.length; i++) {
            var coordinate = coords[i];
            coordinate.placeShip(ship);
        }

        ship.place(coords);
        this.getShips().push(ship);
        this.getShipsPlaced().push(ship);
        return true;

    } else {
        return false;
    }
}

/**
 * Function to undo the last ship placement.
 */
Board.prototype.undoPlaceShip = function(){
    if(!this.getShipsPlaced().length > 0){
        return false;
    }
    var ship = this.getShipsPlaced().pop();
    var coords = ship.getCoordinates();
    for(var i = 0; i< ship.getSize(); i++){
        coords[i].removeShip();
    }
    ship.reset();

    //return [ship, coords, this.getShipsPlaced().length];

    return {
        ship: ship,
        coordinates: coords,
        numShipsPlaced: this.getShipsPlaced().length
    };
}

/**
 * Re-initialise the board and all Coordinate objects.
 */
Board.prototype.resetBoard = function() {
    
    while(this.getShipsPlaced().length > 0) {
        this.undoPlaceShip();
    }
}

/**
 * Moves a ship on the board, if it hasn't been hit.
 */
Board.prototype.moveShip = function(ship, x, y){
    if(ship.isPlaced() && ship.getNumberOfHits() == 0){
        var shipSize = ship.getSize();
        var orientation = ship.getOrientation();
        var xCoord = x;
        var yCoord = y;
        //Check new placement is valid
        for (i = 0; i < shipSize; i++) {
        
            if (xCoord > this.getWidth() - 1 || xCoord < 0 || yCoord > this.getHeight() - 1 || yCoord < 0) {
                return false;
            }

            var coordinate = this.getCoordinateAt(xCoord, yCoord);

            if (coordinate.containsShip() || coordinate.isHit()) {
                return false;
            }

            if (orientation == 0){
                yCoord++;
            } else {
                xCoord++;
            }
        }
        var coords = ship.getCoordinates();
        for(var i = 0; i< shipSize; i++){
            coords[i].removeShip();
        }
        ship.reset();
        //Remove the ship from the placed array.
        var index = this.getShipsPlaced().indexOf(ship);
        this.getShipsPlaced().splice(index, 1);

        this.placeShip(ship, x, y);
    }
}

/**
 * Heals a single ship coordinate that has been hit
 */
Board.prototype.healShipCoord = function(x, y){
    var coordinate = this.getCoordinateAt(x, y);
    if(!coordinate.containsShip() || !coordinate.isHit()){
        return false;
    }
    coordinate.healShip();
    return true;
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
Board.prototype.canFire = function (x, y) {
    if(typeof(x)!='number' || typeof(y)!= 'number'){
        return false;
    }
    var coordinate = this.getCoordinateAt(x, y);
    
    return !coordinate.isHit();
}

/**
 * Fires at a given coordinate
 * @param {number} x value
 * @param {number} y value
 * 
 * @return
 */
Board.prototype.fire = function(x, y) {
    if (this.canFire) {

        var coordinate = this.getCoordinateAt(x, y);

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
Board.prototype.getAdjacentLocations = function(x, y) {
    if(typeof(x)!='number' || typeof(y)!= 'number'){
        return false;
    }
    var locations = new Array();

    if (y - 1 >= 0) {
        locations.push(this.getCoordinateAt(x, y-1)); //9, 4
    }

    if (y + 1 < this.getHeight()) {
        locations.push(this.getCoordinateAt(x, y+1)); //9, 6
    }

    if (x - 1 >= 0) {
        locations.push(this.getCoordinateAt(x-1, y)); //7,5
    }

    if (x + 1 < this.getWidth()) {
        locations.push(this.getCoordinateAt(x+1, y)); //
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
Board.prototype.getMovesAtAdjacentLocations = function(x, y) {
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

/**
 * Returns the ships that have not been sunk
 * @return {ships[]}
 */
Board.prototype.getFloatingShips = function () {
    var ships = new Array();
    var allShips = this.getShipsPlaced();

    for (i = 0; i < allShips.length; i++) {
        
        if (!allShips[i].isDestroyed()) {
            ships.push(allShips[i]);
        }
    }

    return ships;
}

/**
 * Checks to see whether the game is finished
 * 
 * @return {boolean}
 */
Board.prototype.isViable = function(){
    var result = 0;
    var ships = this.getShipsPlaced();
    for(var i = 0; i < ships.length; i++){
        if(!ships[i].isDestroyed()){
            result += 1;
        }
    }
    if (result != 0){
        return true;
    } else {
        return false;
    }
}
