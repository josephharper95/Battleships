<?php
//Wrapper to get items from forms using POST.
class Input{
    //Checks thats input exists
    public static function exists(){
        return(!empty($_POST));
    }
    
    //check an item exists
    public static function itemExists($item){
        return(isset($_POST[$item]));
    }
    
    //Gets the submitted item from post if it exists
    public static function post($item){
        if(Input::itemExists($item)){
            return $_POST[$item];
        }
    }
}