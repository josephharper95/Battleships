function AI(name, board, targetBoard){
    //Create ships
    var destroyer = new Ship("Destroyer", 2);
    var submarine = new Ship("Submarine", 3);
    var cruiser = new Ship("Cruiser", 3);
    var battleship = new Ship("BattleShip", 3);
    var carrier = new Ship("Carrier", 5);

    var _ships = [destroyer, submarine, cruiser, battleship, carrier];
    var _cellsNotYetHit = targetBoard.getListOfCoordinates();

    var _name = name;
    var _board = board;
    var _target = targetBoard;
    

    //Places ships randomly on the board, TODO: Perhaps make it so ships aren't placed too close together.
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

    //Randomly fireing
    this.fire = function(){
        var cell = Math.floor((Math.random() * _cellsNotYetHit.length));
        var temp = _cellsNotYetHit[cell];
        //console.log(_name +" fireing at: "+ temp.getCoordinates());
        _target.fire(temp.getX(), temp.getY());
        _cellsNotYetHit.splice(cell, 1);

        return temp; //ADDED FOR YOU NICK ;)* LYLT D :*
        }
        
    }
