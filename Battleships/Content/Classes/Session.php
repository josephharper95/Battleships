<?php

/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
*
**/

class Session{
    
    /**
    * function to set a new session variable
    * 
    * @param string $name
    * @param object $value
    * @return object $value
    */ 
    public static function set($name, $value){
        return $_SESSION[$name] = $value;
    }
    
    /**
    * returns the value of the given session variable, if it exists
    *
    * @param string $name
    * @return object $_SESSION[$name] or FALSE
    */ 
    public static function get($name){
        if(self::exists($name)){
            return $_SESSION[$name];
        }
        else{
            return false;
        }
    }
    
    /**
    * Unsets the given session variable, if it exists.
    *
    * @param string $name
    */ 
    public static function delete($name){
        if(self::exists($name)){
            unset($_SESSION[$name]);
        }
    }
    
    /**
    * Checks if a session variable exists for the given name.
    *
    * @return boolean
    */ 
    public static function exists($name){
        return (isset($_SESSION[$name]));
    }
}

?>