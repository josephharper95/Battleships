function Board(size) {
    var _ships = new Array();
    var _coordinates = new Array();
    var _height = size;
    var _width = size;

    // initialise board functions

    for (h = 0; h < _height; h++) {
        _coordinates[h] = new Array();

        for (w = 0; w < _width; w++) {
            _coordinates[h][w] = new Coordinate(h, w);
        }
    }
    // end initialise

    this.placeShip = function(x, y, ship) {
        if (this.canPlaceShip(x, y, ship)) {

            var orientation = ship.getOrientation();
            var size = ship.getSize();
            var shipCoordinates = new Array();

            for (i = 0; i < size; i++) {
                var coordinate = _coordinates[x][y];
                coordinate.placeShip(ship);

                shipCoordinates.push(coordinate);

                y = orientation == 0 ? y + 1 : y;
                x = orientation == 1 ? x + 1 : x;
            }

            ship.place(shipCoordinates);
            _ships.push(ship);

        } else {
            return false;
        }
    }

    this.canPlaceShip = function(x, y, ship) {

        if (ship.isPlaced()) {
            return false;
        }

        var orientation = ship.getOrientation();
        var size = ship.getSize();

        for (i = 0; i < size; i++) {
            if (x > _width - 1 || x <= 0 || y > _height - 1 || y <= 0) {
                return false
            }

            var coordinate = _coordinates[x][y];

            if (coordinate.containsShip()) {
                return false;
            }

            y = orientation == 0 ? y + 1 : y;
            x = orientation == 1 ? x + 1 : x;
        }

        return true;
    }

    this.getObjectAt = function(x, y) {
        return _coordinates[x][y];
    }

    this.fire = function(x, y) {
        if (this.canFire) {

            var coordinate = _coordinates[x][y];

            coordinate.fire();

        } else {
            return false;
        }
    }

    this.canFire = function (x, y) {
        var coordinate = _coordinates[x][y];
        
        return !coordinate.isHit();
    }

    this.remainingShips = function() {
        var num = 0;

        for (i = 0; i < _ships.length; i++) {
            num = _ships[i].isSunk() ? num : num + 1;
        }

        return num;
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

        if (x + 1 >= _width) {
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
}