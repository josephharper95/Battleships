<?php

/**
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
* V0.2      Joe     18/01/17    added GET query
*
**/

//Wrapper to get items from forms using POST/GET.
class Input
{
    //Checks thats input exists
    public static function exists()
    {
        return(!empty($_POST));
    }

    //Checks thats input exists
    public static function getExists()
    {
        return(!empty($_GET));
    }
    
    //check an item exists
    public static function itemExists($item)
    {
        return(isset($_POST[$item]));
    }

    //check an item exists
    public static function getItemExists($item)
    {
        return(isset($_GET[$item]));
    }
    
    //Gets the submitted item from post if it exists
    public static function post($item)
    {
        if(Input::itemExists($item))
        {
            return $_POST[$item];
        }
        else
        {
            return false;
        }
    }

    //Gets the submitted item from get if it exists
    public static function get($item)
    {
        if(Input::getItemExists($item))
        {
            return $_GET[$item];
        }
        else
        {
            return false;
        }
    }
}