<?php 
?>

<script language="JavaScript" src="Board.js"></script>
<script language="JavaScript" src="Coordinate.js"></script>
<script language="JavaScript" src="Ship.js"></script>
<script language="JavaScript" src="Game.js"></script>
<script> 
    var game = new Game(10, 10);
    document.write("New game created with a " + game.playerBoard.height + " x " + game.playerBoard.width + " grid<br>");
    
    game.score = 1000;
    document.write("Score set to: " + game.score + "<br>");

    var battleship = new Ship(4, "battleship");
    var submarine = new Ship(3, "submarine");
    var carrier = new Ship(5, "carrier");
    var destroyer = new Ship(3, "destroyer");
    var patrol = new Ship(2, "patrol");

    game.playerBoard.placeShip(1, 1, destroyer);
    document.write("Ship '" + destroyer.name +"' placed with reference at (1,1)<br>");
    document.write("Ship '" + destroyer.name + "' is on the following ");
    for(i = 0; i < game.playerBoard.ships.length; i++)
    {
        if(game.playerBoard.ships[i].name === "destroyer")
        {
            document.write("coordinates: ");
            for(j = 0; j < game.playerBoard.ships[i].coordinates.length; j++)
            {
                document.write("(" + game.playerBoard.ships[i].coordinates[j].x + ", ");
                document.write(game.playerBoard.ships[i].coordinates[j].y + ") || ");
            }
        }
    }
    document.write("<br>");

    var adjacentLocations = game.playerBoard.getAdjacentLocations(new Coordinate(1, 1));
    document.write("Adjacent locations to (1,1): ")
    for(i = 0; i < adjacentLocations.length; i++)
    {
        document.write("(" + adjacentLocations[i].x + ", ");
        document.write(adjacentLocations[i].y + ") || ");
    }

    

</script>