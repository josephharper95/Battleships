function Ship(size, name) {
    // set when class is initialised and can't be overriden
    var _size = size;
    var _name = name;
    var _lives = size;
    var _sunk = false;
    var _isPlaced = false;

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

    this.fire = function () {
        _lives--;

        if (_lives <= 0) {
            _sunk = true;
        }
    }

    this.isSunk = function () {
        return _sunk;
    }

    this.isPlaced = function () {
        return _isPlaced;
    }
};