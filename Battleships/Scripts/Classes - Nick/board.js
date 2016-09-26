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
        if (this.canPlaceShip(ship, x, y)) {
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

        } else {
            return false;
        }
    }

    this.canPlaceShip = function(ship, x, y) {
        var orientation = ship.getOrientation();
        var shipSize = ship.getSize();
        var x = x;
        var y = y;

        // var x = coordinate.getX();
        // var y = coordinate.getY();
        for (i = 0; i < shipSize; i++) {
            if(x >= _size || y >= _size){
                console.log("cannot fit ship here");
                return false;
            }
            if (this.getObjectAt(x,y).containsShip()) {
                return false;
            }
                if(orientation == 0){
                    y++;
                } else{
                    x++;
                }
            }

        return true;
    }

    this.getObjectAt = function(x, y) {
        return _coordinates[x][y];
    }

    this.fire = function(x, y) {
        if (this.canFire) {

            var coordinate = _coordinates[x][y];

            coordinate.recordHit();

        } else {
            return false;
        }
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

    this.getAdjacentLocations = function(coordinate) {

    }

    this.getMovesAtAdjacentLocations = function(coordinate) {

    }
}