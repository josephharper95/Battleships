function Board(size) {
    var _ships = new Array();
    var _coordinates = new Array(_height);
    var _size = size;
    var _height = size;
    var _width = size;
    const MAX_SHIPS = 5;

    // initialise board functions

    for (var h = 0; h < _height; h++) {
        _coordinates[h] = new Array(_width);

        for (var w = 0; w < _width; w++) {
            _coordinates[h][w] = new Coordinate(h, w);
        }
    }
    // end initialise

    this.placeShip = function(ship, x, y) {
        if (this.canPlaceShip(ship, x, y)[0]) {
            var x = x;
            var y = y;
            var orientation = ship.getOrientation();
            var shipSize = ship.getSize();
            var shipCoordinates = new Array();

            for (i = 0; i < shipSize; i++) {
                var coordinate = _coordinates[x][y];
                coordinate.placeShip(ship);

                shipCoordinates.push(coordinate);

                if(orientation == 0){
                    y++;
                } else{
                    x++;
                }
            }

            ship.place(shipCoordinates);
            _ships.push(ship);
            return true;

        } else {
            //console.log("Cannot place ship here");
            return false;
        }
    }

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

    this.getObjectAt = function(x, y) {
        return _coordinates[x][y];
    }

    this.fire = function(x, y) {
        if (this.canFire) {

            var coordinate = _coordinates[x][y];

            var hit = coordinate.recordHit();

            return hit;
        }

        return false;
    }

    this.canFire = function (x, y) {
        var coordinate = _coordinates[x][y];
        
        return !coordinate.isHit();
    }

    this.remainingShips = function() {
         if(_ships.length > 0){
            var result = "";
                for(var i = 0; i < _ships.length; i++){
                    result+= "["+_ships[i].getName() + "]";
                }
            return result;
        }
        else return "No ships remaining";
    }

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

    this.getAdjacentLocations = function(x, y) {
        var locations = new Array();

        // O X O
        // X X X
        // O X O

        // x-1  y-1 diag
        // x    y-1
        // x+1  y-1 diag
        // x-1  y
        // x+1  y
        // x-1  y+1 diag
        // x    y+1
        // x+1  y+1 diag

        if (y - 1 >= 0) {
            locations.push(this.getObjectAt(x, y-1));
        }

        if (y + 1 <= _height - 1) {
            locations.push(this.getObjectAt(x, y+1));
        }

        if (x - 1 >= 0) {
            locations.push(this.getObjectAt(x-1, y));
        }

        if (x + 1 <= _width) {
            locations.push(this.getObjectAt(x+1, y));
        }

        return locations;   
    }

    this.getMovesAtAdjacentLocations = function(x, y) {
        var locations = this.getAdjacentLocations(x, y);
        var availMoveLocations = new Array();

        for (i = 0; i < locations.length; i++) {
            if (!locations[i].isHit()) {
                availMoveLocations.push(locations[i]);
            }
        }

        return availMoveLocations;
    }

    this.getListOfCoordinates = function(){
        var list = new Array();
        for (var h = 0; h < _height; h++) {
            for (var w = 0; w < _width; w++) {
                list.push(_coordinates[h][w]);
            }

        }
        return list;
    }

    //testing
    this.printAdjLocations = function(x,y){
        var arr = this.getAdjacentLocations(x,y);
        var result = "";
                for(var i = 0; i < arr.length; i++){
                    result+= "["+arr[i].getCoordinates() + "]";
                }
            return result;
    }
}