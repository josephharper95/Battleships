function Coordinate(x, y) {
    var _x = x;
    var _y = y;
    var _isHit = false;
    var _containsShip = false;
    var _ship;

    this.getCoordinates = function () {
        return "(" + _x + ", " + _y + ")";
    }

    this.getX = function() {
        return _x;
    }

    this.getY = function() {
        return _y;
    }

    this.getShip = function () {
        if (_containsShip) {
            return _ship;
        } else {
            return false;
        }
    }

    this.containsShip = function() {
        return _containsShip;
    }

    this.placeShip = function(ship) {
        _containsShip = true;
        _ship = ship;
    }

    this.isHit = function() {
        return _isHit;
    }

    this.recordHit = function() {
        if (!_isHit) {
            _isHit = true;
            if(_containsShip){
                _ship.recordHit();

                return true;
            }
        }

        return false;
    }
}