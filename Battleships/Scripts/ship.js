//Constructor
function Ship(name, size, orientation){
    var _name = name;
    var _size = size;
    var _orientation = orientation;
    var _isHit = "false";

    //Getters and Setters
    this.getName = function(){
        return _name;
    }
    this.setName = function(name){
        _name = name;
    }

    this.toString = function(){
        return "Name: " + _name + ", Size: " + _size + 
            ", Orientation: " + _orientation;
    }
}