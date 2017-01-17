/**
*
*
* V0.1      Dave / Nick / Joe   01/10/16    initial creation
* V0.11     Dave                05/10/16    Added comments
* V0.2      Dave                06/10/16    Added removeShip method.
* V0.21     Nick                07/10/16    uncommented record hit code
* V0.3      Nick                15/11/16    added toObject method
* V0.4      Dave                22/12/16    Added heal ship method
* V1.0      Dave                17/01/17    Added logic to deal with land maps
*
**/

function Coordinate(x, y) {
    var _x = x;
    var _y = y;
    var _isHit = false;
    var _containsShip = false;
    var _ship;
    var _isLand = false;

    /**
     * Returns a string of the coordinates
     * 
     * @return {string}
     */
    this.getCoordinates = function () {
        return "(" + _x + ", " + _y + ")";
    }

    /**
     * Returns the value of x
     * @return {number}
     */
    this.getX = function() {
        return _x;
    }

    /**
     * Returns the value of y
     * @return {number}
     */
    this.getY = function() {
        return _y;
    }

    /**
     * Returns the _ship object if it exists
     * 
     * @return {boolean} or {ship}
     */
    this.getShip = function () {
        if (_containsShip) {
            return _ship;
        } else {
            return false;
        }
    }

    /**
     * Returns true if the coordinate contains a ship
     * 
     * @return {boolean}
     */
    this.containsShip = function() {
        return _containsShip;
    }

    /**
     * Updates this coordinate with the ship to be placed
     * @param {Ship}
     */
    this.placeShip = function(ship) {
        _containsShip = true;
        _ship = ship;
    }

    /**
     * Returns true if this coordinate is hit
     * @return {boolean}
     */
    this.isHit = function() {
        return _isHit;
    }

    this.isLand = function(){
        return _isLand;
    }

    /**
     * Heals a single ship coordinate
     */
    this.healShip = function(){
        if(_isHit && _containsShip){
            _isHit = false;
            _ship.heal();
            return true;
        }
        return false;
    }

    /**
     * Function to remove the ship placed on this coordinate
     */
    this.removeShip = function(){
        if(_containsShip){
            _containsShip = false;
            _ship = null;
        }
    }

    /**
     * Record this coordinate as hit. If it contains a ship, record a hit on the ship object.
     * @return {boolean}
     */
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

    this.markAsLand = function(){
        _isLand = true;
    }

    this.toObject = function() {
        return {
            x: _x,
            y: _y,
            isHit: _isHit,
            containsShip: _containsShip
        };
    }
}