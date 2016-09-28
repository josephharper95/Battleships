<?php
class Session{
    
    //function to set a new session variable
    public static function set($name, $value){
        return $_SESSION[$name] = $value;
    }
    
    //returns the value of the given session variable, if it exists
    public static function get($name){
        if(self::exists($name)){
            return $_SESSION[$name];
        }
        else{
            echo 'Session variable not set';
        }
    }
    
    //Unsets the given session variable, if it exists.
    public static function delete($name){
        if(self::exists($name)){
            unset($_SESSION[$name]);
        }
    }
    
    //Checks if a session variable exists for the given name.
    public static function exists($name){
        return (isset($_SESSION[$name])) ? true : false;
    }
}

?>