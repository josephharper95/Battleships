/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
* V0.2      Dave    13/10/16    Changed pattern to use methods attached to the prototype.
*
**/

function AI(name, board, opponentBoard){
    //Create ships
    var destroyer = new Ship("Destroyer", 2);
    var submarine = new Ship("Submarine", 3);
    var cruiser = new Ship("Cruiser", 3);
    var battleship = new Ship("BattleShip", 4);
    var carrier = new Ship("Carrier", 5);

    var _ships = [destroyer, submarine, cruiser, battleship, carrier];
    var _cellsNotYetHit = opponentBoard.getListOfCoordinates();

    var _name = name;
    var _board = board;
    var _opponentBoard = opponentBoard;

    this.getShips = function(){
        return _ships;
    }

    this.getCellsNotYetHit = function(){
        return _cellsNotYetHit;
    }

    this.getBoard = function(){
        return _board;
    }

    this.getOpponentBoard = function(){
        return _opponentBoard;
    }

} //end constructor function

AI.prototype.lastHit = null;
//Adding methods to the prototype so that they can be used for inheritance.
AI.prototype = {
    /**
    * Funciton to randomly place ships on the board.
    */
    placeShips: function(){
        var _shipsPlaced = 0;
        var _ships = this.getShips();
        var _board = this.getBoard();
        for(var i=0; i<_ships.length;i++){
            //generate random coordinates
            var ori = Math.round((Math.random()));
            if(ori == 0){
                _ships[i].changeOrientation();
            }
            //try to place ship at random coordinates until successful
            while(_shipsPlaced <= i){
                var x = Math.floor((Math.random() * _board.getWidth()));
                var y = Math.floor((Math.random() * _board.getWidth()));
            
                if(_board.placeShip(_ships[i], x, y)){
                    _shipsPlaced++;
                }
            }
        }
    },

    /**
     * Function to fire on the enemy board. 
     * For the hack this will only include 'easy mode' in which the targeting is random.
     */
    fire: function(){
        var _cellsNotYetHit = this.getCellsNotYetHit();
        var _opponentBoard = this.getOpponentBoard();
        if(this.lastHit!= null && this.lastHit.containsShip()){
            var moves = _opponentBoard.getMovesAtAdjacentLocations(this.lastHit.getX(), this.lastHit.getY());
            var point = moves[0];
            if(moves[0]){
            _opponentBoard.fire(point.getX(), point.getY());
            this.lastHit = point;
            for (var i = 0; i < _cellsNotYetHit.length; i++) {
                if (_cellsNotYetHit[i] == point) {         
                    _cellsNotYetHit.splice(i, 1);
                    i--;
                }
            }
            return point;
            }
        }
        var cell = Math.floor((Math.random() * _cellsNotYetHit.length));
        var temp = _cellsNotYetHit[cell];
        
        _opponentBoard.fire(temp.getX(), temp.getY());
        _cellsNotYetHit.splice(cell, 1);
        this.lastHit = temp;
        return temp; 
        

    }
}