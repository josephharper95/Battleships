/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    17/10/2016 initial creation
**/

function AIHard(name, board, targetBoard){
    AI.call(this, name, board, targetBoard);

    var target = this.getTarget();
    var targetCoords = target.getCoordinates();
    var size = targetCoords.length;
    var virtualBoard = new Board(size);
    var coordinates = virtualBoard.getCoordinates();
    var probabilityDensity = new Array(size);
    for (var i = 0; i < probabilityDensity.length; i++) {
        probabilityDensity[i] = new Array(probabilityDensity.length);

        for (var j = 0; j < probabilityDensity[i].length; j++) {
            probabilityDensity[i][j] = 0;
        }
    }

    //Create virtual ships to use as measuring tools.
    var ship2 = new Ship("2", 2);
    var ship3 = new Ship("3", 3);
    var ship33 = new Ship("3", 3);
    var ship4 = new Ship("4", 4);
    var ship5 = new Ship("5", 5);

    var ships = [ship2, ship3, ship33, ship4, ship5];

    /**Updates the probability density for each cell by iterating over the whole board and seeing if each ship can be fit horizontaly
     * or vertically. If so the probability of that square is increased. Coordinates next to a hit but not sunk ship are given a larger probability.
     */
    this.refreshProbability = function(){
        //reset the probabilitys
        for (var i = 0; i < probabilityDensity.length; i++) {
        probabilityDensity[i] = new Array(probabilityDensity.length);
            for (var j = 0; j < probabilityDensity[i].length; j++) {
                probabilityDensity[i][j] = 0;
            }
        }
        //will target if there is a ship that is hit but not sunk
        var targetMode = this.isTargeting();
        //Iterate over all coordinates
        for(var x = 0; x < coordinates.length; x++){
            for(var y = 0; y < coordinates[x].length; y++){
                //Iterate though the remaining ships
                for(var s = 0; s< ships.length; s++){
                        //If the ship fits, calcuate its other coordinates
                        if(this.calcShipCoords(ships[s], x, y, targetMode)){
                            var coords = this.calcShipCoords(ships[s], x, y, targetMode);
                            //If the ship would cover already hit locations, give a larger probability.
                            if(this.hitCoords(coords) > 0){
                                for(var i = 0; i < coords.length; i++){
                                    //The more hit locations covered, the higher the chance of a real ship being there.
                                    probabilityDensity[coords[i].getX()][coords[i].getY()] += 100 * this.hitCoords(coords);
                                }
                            }
                            else {
                                for (var i = 0; i < coords.length; i++) {
                                    //Increment the probability for all ship coordinates by 1
                                    probabilityDensity[coords[i].getX()][coords[i].getY()]++;
                                }
                            }   
                    }
                    //Switch the orientation of the ship and then repeat.
                        ships[s].changeOrientation();
                        if(this.calcShipCoords(ships[s], x, y, targetMode)){
                            var coords = this.calcShipCoords(ships[s], x, y, targetMode);
                            if(this.hitCoords(coords) > 0){
                                for(var i = 0; i < coords.length; i++){
                                    probabilityDensity[coords[i].getX()][coords[i].getY()] += 100 * this.hitCoords(coords);
                                }
                            }
                            else {
                                for (var i = 0; i < coords.length; i++) {
                                    probabilityDensity[coords[i].getX()][coords[i].getY()]++;
                                }
                            }   
                        }
                        ships[s].changeOrientation();
                    //hit cells are given a probability of 0 to ensure they are not targeted again.
                    if(targetCoords[x][y].isHit()){
                        probabilityDensity[x][y] = 0;
                    }
                }
            }
        }
    }

    /**
     * Returns the number of coordinates passed through that are already hit. The higher the number, 
     * the greater the chance of there being other parts of a ship in the given coordinates.
     */
   this.hitCoords= function(shipCoords) {
       var hits = 0;
        for (var i = 0; i < shipCoords.length; i++) {
            
            if (targetCoords[shipCoords[i].getX()][shipCoords[i].getY()].isHit() && 
                targetCoords[shipCoords[i].getX()][shipCoords[i].getY()].containsShip() &&
                !targetCoords[shipCoords[i].getX()][shipCoords[i].getY()].getShip().isDestroyed()) {
                hits ++;
            }
        }
        return hits;
    }   

    /**
     * Analyses the probability board and randomly fires on the coordinates that share the highest probability. 
     * After each shot the probability board is updated.
     */
    this.fire = function(){
        var highestVal = 0;
        for (var i = 0; i < probabilityDensity.length; i++) {
            for (var j = 0; j < probabilityDensity[i].length; j++) {
                if(probabilityDensity[i][j] > highestVal){
                    highestVal = probabilityDensity[i][j]
                }
            }
        }

        var possibleShots = new Array();
        for (var i = 0; i < probabilityDensity.length; i++) {
            for (var j = 0; j < probabilityDensity[i].length; j++) {
                if(probabilityDensity[i][j] == highestVal){
                    possibleShots.push(coordinates[i][j]);
                }
            }
        }
        var index = Math.floor((Math.random() * possibleShots.length));
        var temp = possibleShots[index];
        var hit = target.fire(temp.getX(), temp.getY());
        var shot = target.getCoordinateAt(temp.getX(),temp.getY());

        if(hit){
            var size = shot.getShip().getSize();
                var i = ships.length -1;
                if(shot.getShip().isDestroyed()){
                    while(i > 0){
                    if(ships[i].getSize() == size){
                        ships.splice(i,1);
                        break;
                    }
                    i--;
                    }
                }
                var coords = shot.getShip().coordinates();
                for(var i = 0; i<coords.length; i++){
                    probabilityDensity[coords[i].getX()][coords[i].getY()] = 0;
                }
        }
        virtualBoard.fire(temp.getX(), temp.getY());
        this.refreshProbability();
        return shot;
    }

    /**
     * Returns true if there is a ship which has been hit but not sunk
     */
    this.isTargeting = function(){
        var remainingShips = target.getShipsPlaced();
        var targetMode = false;
        for(var i = 0; i < remainingShips.length; i++){
            if(remainingShips[i].getNumberOfHits() > 0 && !remainingShips[i].isDestroyed()){
                targetMode = true;
            }
        }
        return targetMode;
    }

    /**
     * Returns the coordinates for the given ship, given its head coordinate.
     */
    this.calcShipCoords = function(ship, x, y, targetMode){
        var coords = new Array();
        for (i = 0; i < ship.getSize(); i++) {

            if (x > size -1 || x < 0 || y > size -1 || y < 0) {
                return false;
            }

            var coordinate = coordinates[x][y];
            coords.push(coordinate);

            if (!targetMode && coordinate.isHit()) {
                return false;
            }

            if (ship.getOrientation() == 0){
                y++;
            } else {
                x++;
            }
        }
        return coords;
    }

    this.toString = function(){
        document.write("<table>");
        for (var i = 0; i < probabilityDensity.length; i++) {
                document.write("<tr>");
            for (var j = 0; j < probabilityDensity[i].length; j++) {
                document.write("<td>"+ probabilityDensity[i][j] + "</td>");
            }
            document.write("</tr>");
        }
        document.write("</table>");
    }
}

// Inherit from AI
AIHard.prototype = Object.create(AI.prototype);
AIHard.prototype.constructor = AI;


