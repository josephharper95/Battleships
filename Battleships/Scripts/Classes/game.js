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
}