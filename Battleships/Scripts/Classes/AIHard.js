/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    17/10/2016    initial creation
* V0.11     Joe     26/10/2016    renamed methods
* v0.12     Dave    29/10/2016    renamed methods
**/
function AIHard(name, board, targetBoard){
    AI.call(this, name, board, targetBoard);

    var opponentBoard = this.getOpponentBoard();
    var opponentBoardCoordinates = opponentBoard.getCoordinates();
    var size = opponentBoardCoordinates.length;
    var virtualBoard = new Board(size);
    var virtualBoardCoordinates = virtualBoard.getCoordinates();
    var probabilityDensity = new Array(size);


    // Create virtual ships to use as measuring tools.
    var ship2 = new Ship("2", 2);
    var ship3 = new Ship("3", 3);
    var ship33 = new Ship("3", 3);
    var ship4 = new Ship("4", 4);
    var ship5 = new Ship("5", 5);

    var ships = [ship2, ship3, ship33, ship4, ship5];

    this.resetProbability = function () {
        for (var i = 0; i < probabilityDensity.length; i++) {
            probabilityDensity[i] = new Array(probabilityDensity.length);

            for (var j = 0; j < probabilityDensity[i].length; j++) {
                probabilityDensity[i][j] = 0;
            }
        }
    }

    this.resetProbability();

    /**
     * Updates the probability density for each cell by iterating over the whole board and seeing if each ship can be fit horizontally or vertically.
     * If so the probability of that square is increased. Coordinates next to a hit but not sunk ship are given a larger probability.
     */
    this.refreshProbability = function() {

        //reset the probabilities
        this.resetProbability();

        //will opponentBoard if there is a ship that is hit but not sunk
        var targetMode = this.isTargeting();

        // Iterate through rows
        for (var x = 0; x < virtualBoardCoordinates.length; x++) {

            // Iterate through columns
            for (var y = 0; y < virtualBoardCoordinates[x].length; y++) {

                // Iterate though the ships in array
                for(var s = 0; s < ships.length; s++){

                    // update the probability density for the cell
                    this.updateProbabilityDensity(ships[s], x, y, targetMode);

                    //Switch the orientation of the ship and then repeat.
                    ships[s].changeOrientation();

                    // update the probability density for the cell
                    this.updateProbabilityDensity(ships[s], x, y, targetMode);

                    // swap the orientation back
                    ships[s].changeOrientation();

                    //hit cells are given a probability of 0 to ensure they are not targeted again.
                    if (opponentBoardCoordinates[x][y].isHit()) {
                        probabilityDensity[x][y] = 0;
                    }
                }
            }
        }
    }

    /**
     * Function to update probability density - extracted to method to avoid duplication
     */
    this.updateProbabilityDensity = function (ship, x, y, targetMode) {

        // get the coordinates / false value
        var coords = this.calcShipCoords(ship, x, y, targetMode);

        // If the ship fits, calcuate its other coordinates
        if (coords) {

            // number of hits
            var hits = this.hitCoords(coords);
            
            for (var i = 0; i < coords.length; i++) {

                //The more hit locations covered, the higher the chance of a real ship being there.
                probabilityDensity[coords[i].getX()][coords[i].getY()] += (hits > 0 ? 100 * hits : 1);
            }
        }
    }

    /**
     * Returns the number of virtualBoardCoordinates passed through that are already hit. The higher the number, 
     * the greater the chance of there being other parts of a ship in the given virtualBoardCoordinates.
     */
   this.hitCoords = function(shipCoords) {

        // initialise
        var hits = 0;

        // iterate through coordinate objects passed in
        for (var i = 0; i < shipCoords.length; i++) {
            
            // initialise local variables
            var x = shipCoords[i].getX();
            var y = shipCoords[i].getY();
            
            // if coordinate is hit, coordinate contains ship, and the ship is destroyed...
            if (opponentBoardCoordinates[x][y].isHit() && 
                opponentBoardCoordinates[x][y].containsShip() &&
                !opponentBoardCoordinates[x][y].getShip().isDestroyed()) {
                hits++;
            }
        }

        // return the amount of hits registered
        return hits;
    }   

    /**
     * Analyses the probability board and randomly fires on the virtualBoardCoordinates that share the highest probability. 
     * After each shot the probability board is updated.
     */
    this.fire = function() {

        // initialise values for function
        var highestVal = 0;
        var possibleShots = new Array();

        // recurse through probability density 3D
        for (var i = 0; i < probabilityDensity.length; i++) {

            for (var j = 0; j < probabilityDensity[i].length; j++) {

                if (probabilityDensity[i][j] > highestVal) {
                    highestVal = probabilityDensity[i][j];

                    var possibleShots = new Array();
                }

                if (probabilityDensity[i][j] == highestVal) {
                    possibleShots.push(virtualBoardCoordinates[i][j]);
                }
            }
        }

        // get a random number
        var index = Math.floor((Math.random() * possibleShots.length));
        var temp = possibleShots[index];
        var hit = opponentBoard.fire(temp.getX(), temp.getY());
        var shotCoordinate = opponentBoard.getCoordinateAt(temp.getX(),temp.getY());

        if (hit) {
            var ship = shotCoordinate.getShip();
            var size = ship.getSize();
            var i = ships.length -1;

            if (ship.isDestroyed()) {

                for (i = 0; i < ships.length; i++) {
                    if (ships[i].getSize() == size) {
                        
                        ships.splice(i, 1);
                        break;
                    }
                }
            }

            var coords = ship.getCoordinates();
            for (var i = 0; i < coords.length; i++) {
                probabilityDensity[coords[i].getX()][coords[i].getY()] = 0;
            }
        }

        virtualBoard.fire(temp.getX(), temp.getY());
        this.refreshProbability();
        return shotCoordinate;
    }

    /**
     * Returns true if there is a ship which has been hit but not sunk
     * 
     * Returns  {Boolean}   whether or not opponentBoard mode is on or off
     */
    this.isTargeting = function() {

        // get the opponent ships and initialise boolean
        var opponentShips = opponentBoard.getShips();

        // iterate through each ship
        for (var i = 0; i < opponentShips.length; i++) {

            // initialise local variable
            var ship = opponentShips[i];

            // if the ship has been hit but isn't destroyed...
            if (ship.getNumberOfHits() > 0 && !ship.isDestroyed()){
                return true;
            }
        }

        // if no ships found, return false
        return false;
    }

    /**
     * Returns the virtualBoardCoordinates for the given ship, given its head coordinate.
     */
    this.calcShipCoords = function(ship, x, y, targetMode) {

        // initialise
        var coords = new Array();

        // iterate for the ship's size
        for (i = 0; i < ship.getSize(); i++) {

            // check to see if virtualBoardCoordinates are out of bounds
            if (x > (size - 1) || x < 0 || y > (size - 1) || y < 0) {
                return false;
            }

            // get the coordinate object from the virtual board
            var coordinate = virtualBoardCoordinates[x][y];

            // push the coordinate onto the array
            coords.push(coordinate);

            // if we do not want to target AND the coordinate has already been hit...
            if (!targetMode && coordinate.isHit()) {
                return false;
            }

            // adjust y / x values for next iteration
            if (ship.getOrientation() == 0) {
                y++;
            } else {
                x++;
            }
        }

        // return the coordinates back
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
AIHard.prototype.constructor = AIHard;