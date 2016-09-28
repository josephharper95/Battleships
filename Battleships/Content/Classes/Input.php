<?php
require_once("require/functions.php");
//Wrapper to get items from forms using POST.
class Input{
    //Checks thats input exists
    public static function exists(){
        return(!empty($_POST)) ? true : false;
    }
    
    //check an item exists
    public static function itemExists($item){
        return(isset($_POST[$item])) ? true : false;
    }
    
    //Gets the submitted item if it exists
    public static function get($item){
        if(Input::itemExists($item)){
            return $_POST[$item];
        }
    }
}