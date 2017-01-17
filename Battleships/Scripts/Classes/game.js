/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.11     Dave    05/10/16    Added comments
* V0.12     Dave    29/11/16    Added methods to track perks available
* V0.13     Nick    01/12/16    changed BounceBomb to Bounce_Bomb so other files can add a space in between
* V0.14     Dave    01/12/16    Fixed bug with perks not showing on large boards.
* V0.15     Nick    02/12/16    bug fix
* V0.2      Nick    06/12/16    added mortar and updated quantities
*
**/

function Game(size) {
    //initalise both boards.
    var landCoords; //= [{x:0, y:0}, {x:1, y:5}, {x:2, y:5}, {x:3, y:5}, {x:4, y:5}, {x:5, y:5}, {x:6, y:5},
    //{x:1, y:0}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}, {x:6, y:6}];
    var _playerBoard = new Board(size, landCoords);
    var _computerBoard = new Board(size, landCoords);
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
            },
            _playerPerks["Mortar"] = {
                "usesLeft": 1
            }
            break;
        case 15:
            _playerPerks['Sonar'] = {
                "usesLeft": 2
            }
            _playerPerks['Bounce_Bomb'] = {
                "usesLeft": 2
            },
            _playerPerks["Mortar"] = {
                "usesLeft": 1
            }
            break;
        case 20:
            _playerPerks['Sonar'] = {
                "usesLeft": 4
            }
            _playerPerks['Bounce_Bomb'] = {
                "usesLeft": 4
            },
            _playerPerks["Mortar"] = {
                "usesLeft": 2
            }
            break;
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
    this.updatePlayerPerks = function(perk) {


        if (typeof(perk) != "string") {
            return false;
        }

        if (!_playerPerks[perk]) {
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