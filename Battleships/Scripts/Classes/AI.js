/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
*
**/

function AI(name, board, targetBoard){
    //Create ships
    var destroyer = new Ship("Destroyer", 2);
    var submarine = new Ship("Submarine", 3);
    var cruiser = new Ship("Cruiser", 3);
    var battleship = new Ship("BattleShip", 4);
    var carrier = new Ship("Carrier", 5);

    var _ships = [destroyer, submarine, cruiser, battleship, carrier];
    var _cellsNotYetHit = targetBoard.getListOfCoordinates();

    var _name = name;
    var _board = board;
    var _target = targetBoard;
    

    /**
     * Funciton to randomly place ships on the board.
     */
    this.placeShips = function(){
        var _shipsPlaced = 0;
        
        for(var i=0; i<_ships.length;i++){
            //generate random coordinates
            var ori = Math.round((Math.random()));
            if(ori == 0){
                _ships[i].changeOrientation();
            }
            //try to place ship at random coordinates until successful
            while(_shipsPlaced <= i){
                var x = Math.floor((Math.random() * 10));
                var y = Math.floor((Math.random() * 10));
            
                if(_board.placeShip(_ships[i], x, y)){
                    _shipsPlaced++;
                }
            }
        }
    }

    /**
     * Function to fire on the enemy board. 
     * For the hack this will only include 'easy mode' in which the targeting is random.
     */
    this.fire = function(){
        var cell = Math.floor((Math.random() * _cellsNotYetHit.length));
        var temp = _cellsNotYetHit[cell];
        //console.log(_name +" fireing at: "+ temp.getCoordinates());
        _target.fire(temp.getX(), temp.getY());
        _cellsNotYetHit.splice(cell, 1);

        return temp; 
        }
        
    }
