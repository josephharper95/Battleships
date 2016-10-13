/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    03/10/16    initial creation
* V0.2      Dave    13/10.16    overidden fire method from the super class.
**/

function AIMedium(name, board, targetBoard){
    AI.call(this, name, board, targetBoard);
}

// Inherit from AI
AIMedium.prototype = Object.create(AI.prototype);
AIMedium.prototype.constructor = AI;

AIMedium.prototype.lastHit = new Array();



AIMedium.prototype.fire = function(){
    var _cellsNotYetHit = this.getCellsNotYetHit();
    var _target = this.getTarget();
    if(this.lastHit.length < 1){
        var cell = Math.floor((Math.random() * _cellsNotYetHit.length));
        var point = _cellsNotYetHit[cell];
        _target.fire(point.getX(), point.getY());
        _cellsNotYetHit.splice(cell, 1);
        this.lastHit.push(point);
        return point; 
    }
    var peek = this.lastHit[this.lastHit.length -1];

    if(peek.containsShip() && !peek.getShip().isDestroyed()){
        var moves = _target.getMovesAtAdjacentLocations(peek.getX(), peek.getY());
        var point = moves[0];
        if(moves[0]){
        _target.fire(point.getX(), point.getY());
        this.lastHit.push(point);
        for (var i = 0; i < _cellsNotYetHit.length; i++) {
            if (_cellsNotYetHit[i] == point) {         
                _cellsNotYetHit.splice(i, 1);
                i--;
            }
        }
        return point;
        }
    } 
    this.lastHit.pop();
    var point = this.fire();
    return point;

    
}
