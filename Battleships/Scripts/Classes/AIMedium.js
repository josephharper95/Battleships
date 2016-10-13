/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    03/10/16    initial creation
*
**/

function AIMedium(name, board, targetBoard){
    AI.call(this, name, board, targetBoard);
}

// Inherit from AI
AIMedium.prototype = Object.create(AI.prototype);
AIMedium.prototype.constructor = AI;


/*Overwriting the fire method
AIMedium.prototype.fire = function(){
   console.log("testing");
   //call the fire method from parent.
   console.log(AI.prototype.fire.apply(this));
}*/
