/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
*
**/

function Game(size) {
    //initalise both boards.
    var _playerBoard = new Board(size);
    var _computerBoard = new Board(size);
    var playerTurn = true;

    /**
     * Returns the player board
     * 
     * @return {Board}
     */
    this.getPlayerBoard = function () {
        return _playerBoard;
    }

    /**
     * Returns the Computer board
     * 
     * @return {Board}
     */
    this.getComputerBoard = function () {
        return _computerBoard;
    }

    /**
     * Checks both boards to see if the game is finished.
     * 
     * @return {boolean}
     */
    this.isViable = function () {
        return _playerBoard.isViable() && _computerBoard.isViable();
    }
}