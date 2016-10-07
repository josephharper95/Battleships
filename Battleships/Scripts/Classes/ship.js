/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave / Nick / Joe   01/10/16    initial creation
* V0.11     Dave                06/10/16    commented code
* V0.2      Dave                07/10/16    added reset method
*
**/

function Ship(name, size) {
    // set when class is initialised and can't be overriden
    var _size = size;
    var _name = name;
    var _isPlaced = false;
    var _numberOfHits = 0;
    var _isDestroyed = false;

    // set when ship is placed on board
    var _coordinates = new Array();
    var _orientation = 1;

    this.reset = function(){
        _isPlaced = false;
    }

    /**
     * Returns the ship size
     * 
     * @return {number}
     */
    this.getSize = function () {
        return _size;
    };

    /**
     * Returns the ship name
     * 
     * @return {String}
     */
    this.getName = function () {
        return _name;
    };

    /**
     * Returns the coordinates
     */
    this.coordinates = function () {
        return _coordinates;
    };

    /**
     * Returns the ship orientation
     */
    this.getOrientation = function () {
        return _orientation;
    };

    /**
     * Changes the ships orientation
     * 
     * @return {boolean} false if the ship is not placed
     */
    this.changeOrientation = function() {
        if (_isPlaced) {
            return false;
        }
        
        // 1 = vertical
        // 0 = horizontal
        _orientation = _orientation == 1 ? 0 : 1;
    }

    /**
     * Sets the ships coordinates and isPlaced flag
     * @param {Coordinates[]} array of coordinates
     */
    this.place = function (coordinates) {
        _coordinates = coordinates;
        _isPlaced = true;
    }

    /**
     * Records a hit on the ship, if the number of hits equals its size, then the ship is destroyed.
     */
    this.recordHit = function () {
        _numberOfHits++;

        if (_numberOfHits == _size) {
            _isDestroyed = true;
        }
    }

    /**
     * Returns if the ship is destroyed or not.
     * 
     * @return {boolean}
     */
    this.isDestroyed = function () {
        return _isDestroyed;
    }

    /**
     * Returns a string representation of this ship
     * 
     * @return {String}
     */
    this.toString = function(){
        return _name +", Size: "+ _size +", Orientation: " +_orientation + 
        ", No. of hits: " +_numberOfHits+", Is destroyed: " + _isDestroyed;
    }
    
    /**
     * Returns if the ship is placed or not
     * 
     * @return {boolean}
     */
    this.isPlaced = function () {
        return _isPlaced;
    }
};