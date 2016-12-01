/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
* V0.12     Dave    29/11/16    Added methods to track perks available
* V0.13     Nick    01/12/16    changed BounceBomb to Bounce_Bomb so other files can add a space in between
*
**/

function Game(size) {
    //initalise both boards.
    var _playerBoard = new Board(size);
    var _computerBoard = new Board(size);
    var playerTurn = true;
    var _size = size;
    var _playerPerks = {};

    //Initialise perks availble according to board size
    switch(_size) {
        case 10:
            _playerPerks['Sonar'] = {
                "usesLeft": 0
            }
            _playerPerks['Bounce_Bomb'] = {
                "usesLeft": 1
            }
            break;
        case 15:
            _playerPerks['Sonar'] = {
                "usesLeft": 1
            }
            _playerPerks['Bounce_Bomb'] = {
                "usesLeft": 1
            }
            break;
        case 20:
            _playerPerks['Sonar'] = {
                "usesLeft": 2
            }
            _playerPerks['Bounce_Bomb'] = {
                "usesLeft": 2
            }
        default:
            _playerPerks = null;
    }

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
     * Returns the board size
     * @return {number}
     */
    this.getSize = function(){
        return _size;
    }

    /**
     * Returns the perks available
     * 
     * @return {object}
     */
    this.getPlayerPerksAvailable = function(){
        return _playerPerks;
    }

    /**
     * Decrements the given perk by 1
     */
    this.updatePlayerPerks = function(perk){
        if(typeof(perk) != "string"){
            return false;
        }
        if(perk!="Sonar" || perk!= "Bounce_Bomb"){
            return false;
        }
        _playerPerks[perk].usesLeft -= 1;
        return true;
    }
}
/**
 * Checks both boards to see if the game is finished.
 * 
 * @return {boolean}
 */
Game.prototype.isViable = function () {
        return this.getPlayerBoard().isViable() && this.getComputerBoard().isViable();
}