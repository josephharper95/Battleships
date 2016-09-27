function Ship(name, size) {
    // set when class is initialised and can't be overriden
    var _size = size;
    var _name = name;
    var _isPlaced = false;
    var _numberOfHits = 0;
    var _isDestroyed = false;

    // set when ship is placed on board
    var _coordinates;
    var _orientation = 1;

    this.getSize = function () {
        return _size;
    };

    this.getName = function () {
        return _name;
    };

    this.coordinates = function () {
        return _coordinates;
    };

    this.getOrientation = function () {
        return _orientation;
    };

    this.changeOrientation = function() {
        if (_isPlaced) {
            return false;
        }
        
        // 1 = vertical
        // 0 = horizontal
        _orientation = _orientation == 1 ? 0 : 1;
    }

    this.place = function (coordinates) {
        _coordinates = coordinates;
        _isPlaced = true;
    }

    this.recordHit = function () {
        _numberOfHits++;

        if (_numberOfHits == _size) {
            _isDestroyed = true;
        }
    }

    this.isDestroyed = function () {
        return _isDestroyed;
    }

    this.toString = function(){
        return _name +", Size: "+ _size +", Orientation: " +_orientation + 
        ", No. of hits: " +_numberOfHits+", Is destroyed: " + _isDestroyed;
    }

    this.isPlaced = function () {
        return _isPlaced;
    }
};