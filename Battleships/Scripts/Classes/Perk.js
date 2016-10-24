/**
*
* Last Modified By: Dave MacDonald
*
* V0.1      Dave    24/10/2016       
*
**/
function Perk(){
    if(this.constructor === Perk){
        throw new Error("Can't instantiate an abstract class.");
    }
}
/**
 * @abstract
 */
Perk.prototype.action = function(x, y){
    //throw new Error("Abstract method");
    return x;
}