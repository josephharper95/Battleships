function AI(){
    //Create ships
    var destroyer = new Ship("Destroyer", 4);
    var carier = new Ship("Carier", 5);
    var patrol = new Ship("Patrol", 2);
    var sub = new Ship("Submarine",3);
    var battleship = new Ship("BattleShip", 3);
    var _ships = [destroyer, carier, patrol, sub, battleship];
    

    //Places ships randomly on the board, TODO: Perhaps make it so ships aren't placed too close together.
    this.placeShips = function(board){
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
           
            if(board.placeShip(_ships[i], x, y)){
                _shipsPlaced ++;
            }
            }
        }
    }

    this.fire = function(){
        
    }
}