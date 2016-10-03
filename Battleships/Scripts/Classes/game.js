/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
*
**/

function Game(size) {
    var _playerBoard = new Board(size);
    var _computerBoard = new Board(size);
    var playerTurn = true;

    this.getPlayerBoard = function () {
        return _playerBoard;
    }

    this.getComputerBoard = function () {
        return _computerBoard;
    }

    this.isViable = function () {
        return _playerBoard.isViable() && _computerBoard.isViable();
    }
}