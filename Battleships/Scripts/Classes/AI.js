/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
* V0.2      Dave    13/10/16    Changed pattern to use methods attached to the prototype.
* V0.3      Nick    10/01/16    Added the ability to pass custom ships
* V0.31     Nick    16/01/16    Fixed bug where opponentShipDetails was not defined
* V0.32     Nick    21/01/17    final comments added
*
**/

// global variables
var opponentShipDetails;

/**
 * Constructor for class
 * 
 * @param   {string}    name            name of AI
 * @param   {Board}     board           the AI's board
 * @param   {Board}     opponentBoard   the AI's opponent's board
 */
function AI(name, board, opponentBoard) {

    //Create ships
    var destroyer = new Ship("Destroyer", 2);
    var submarine = new Ship("Submarine", 3);
    var cruiser = new Ship("Cruiser", 3);
    var battleship = new Ship("BattleShip", 4);
    var carrier = new Ship("Carrier", 5);

    // user's ships array
    var _ships = [destroyer, submarine, cruiser, battleship, carrier];

    // get the list of coordinates from the opponent's board
    var _cellsNotYetHit = opponentBoard.getListOfCoordinates();

    // set private variables
    var _name = name;
    var _board = board;
    var _opponentBoard = opponentBoard;

    /**
     * Accessor method for getting AI ships
     */
    this.getShips = function() {
        return _ships;
    }

    /**
     * Accessor method for getting the cells not yet hit
     */
    this.getCellsNotYetHit = function() {
        return _cellsNotYetHit;
    }

    /**
     * Accessor method for returning the AI's board
     */
    this.getBoard = function(){
        return _board;
    }

    /**
     * Accessor method for returning the AI's opponent's board
     */
    this.getOpponentBoard = function() {
        return _opponentBoard;
    }

}

// initialise the last hit to be nothing
AI.prototype.lastHit = null;

//Adding methods to the prototype so that they can be used for inheritance.
AI.prototype = {

    /**
     * Function that will randomly place the AI ships onto the board
     */
    placeShips: function() {

        var _shipsPlaced = 0;
        var _ships = this.getShips();
        var _board = this.getBoard();

        // if opponentShipDetails has been passed, overwrite the ships
        if (opponentShipDetails) {

            // initialise an empty array
            var x = new Array();

            // iterate through the ships
            for (var i = 0; i < opponentShipDetails.length; i++) {
                
                // create a ship object and at to array
                x.push(new Ship(opponentShipDetails[i].name, opponentShipDetails[i].size));
            }

            // overwrite the AI's ships
            _ships = x;
        }

        // iterate through the ships to be placed
        for (var i = 0; i < _ships.length; i++) {

            // generate a random orientation
            var ori = Math.round((Math.random()));

            // if the orientation is 0 (i.e. not 1) change the orientation
            if (ori == 0) {

                _ships[i].changeOrientation();
            }

            // try to place ship at random coordinates until successful
            while (_shipsPlaced <= i) {

                // generate a random x and y
                var x = Math.floor((Math.random() * _board.getWidth()));
                var y = Math.floor((Math.random() * _board.getWidth()));
            
                // if the ship can be placed on the board, increment the amount of ships placed
                if (_board.placeShip(_ships[i], x, y)) {
                    _shipsPlaced++;
                }
            }
        }
    },

    /**
     * Function to fire on the enemy board
     * 
     * @returns     {Coordinate}    the coordinate that has been hit
     */
    fire: function() {

        // get the cells not hit yet and the opponent's board
        var _cellsNotYetHit = this.getCellsNotYetHit();
        var _opponentBoard = this.getOpponentBoard();

        // if the last hit location contains a ship
        if (this.lastHit != null && this.lastHit.containsShip()) {

            // get the adjacent locations
            var moves = _opponentBoard.getMovesAtAdjacentLocations(this.lastHit.getX(), this.lastHit.getY());
            var point = moves[0];

            // check that there is a valid move
            if (moves[0]) {

                // fire at the coordinate
                _opponentBoard.fire(point.getX(), point.getY());

                // set the last hit coordinate
                this.lastHit = point;
                
                // iterate through the cells not hit
                for (var i = 0; i < _cellsNotYetHit.length; i++) {
                
                    // if the current cell is equal to the one just hit
                    if (_cellsNotYetHit[i] == point) {

                        // remove this move from the array
                        _cellsNotYetHit.splice(i, 1);
                        
                        // break out of the loop
                        break;
                    }
                }

                // return the point hit
                return point;
            }
        }

        // if there wasn't a last hit, or there wasn't a valid move next to a hit ship, find another move

        // get a random cell
        var cell = Math.floor((Math.random() * _cellsNotYetHit.length));

        // put the coordinate to a temporary variable
        var temp = _cellsNotYetHit[cell];

        // fire at the board
        _opponentBoard.fire(temp.getX(), temp.getY());

        // remove the coordinate from the array
        _cellsNotYetHit.splice(cell, 1);

        // set the last hit
        this.lastHit = temp;

        // return the coordinate
        return temp;
    }
}