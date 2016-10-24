/**
 * 
 * Last Modified By: Nick Holdsworth
 * Current Version: 0.3
 *
 *  V0.1    Dave    03/10/16    initial creation
 *  V0.2    Dave    13/10.16    overidden fire method from the super class.
 *  V0.3    Nick    20/10/16    refactoring following code review
 * 
 */

function AIMedium(name, board, targetBoard){
    AI.call(this, name, board, targetBoard);
}

// Inherit from AI
AIMedium.prototype = Object.create(AI.prototype);
AIMedium.prototype.constructor = AI;

// initialise other variables
AIMedium.prototype.lastHit = new Array();

/**
 * Override method from the AI class
 * 
 * return   {Coordinate}    the coordinate that has been hit
 */
AIMedium.prototype.fire = function() {

    // initialise the cells that have not been hit
    var _cellsNotYetHit = this.getCellsNotYetHit();

    // get the opponent board object
    var opponentBoard = this.getOpponentBoard();

    // if there aren't any previous moves to check...
    if (this.lastHit.length < 1) {

        // get a random number
        var rand = Math.floor((Math.random() * _cellsNotYetHit.length));

        // get the coordinate object using the random number
        var coordinate = _cellsNotYetHit[rand];

        // fire on the coordinate found
        opponentBoard.fire(coordinate.getX(), coordinate.getY());

        // remove the coordinate hit from the list of cells left
        _cellsNotYetHit.splice(coordinate, 1);

        // push the coordinate to the last hit stack
        this.lastHit.push(coordinate);

        // return the object (for UI)
        return coordinate; 
    }

    // get the last hit coordinate
    var lastHit = this.lastHit[this.lastHit.length -1];

    // check that the last hit coordinate contains a ship, and that the ship has not been destroyed
    if (lastHit.containsShip() && !lastHit.getShip().isDestroyed()) {

        // get a list of possible moves
        var moves = opponentBoard.getMovesAtAdjacentLocations(lastHit.getX(), lastHit.getY());

        // validate that there are moves
        if (moves.length > 0) {

            // choose the first possible coordinate
            var coordinate = moves[0];

            // fire on the board
            opponentBoard.fire(coordinate.getX(), coordinate.getY());

            // push the coordinate onto the stack
            this.lastHit.push(coordinate);

            // find the cell that has been hit
            for (var i = 0; i < _cellsNotYetHit.length; i++) {

                // locate coordinate
                if (_cellsNotYetHit[i] == coordinate) {

                    // remove from list         
                    _cellsNotYetHit.splice(i, 1);

                    // break out of loop to increase efficiency
                    break;
                }
            }

            // return the coordinate
            return coordinate;
        }
    } 

    // if none of the above has succeeded, pop the last hit and use recursion
    this.lastHit.pop();
    var point = this.fire();
    return point;   
}