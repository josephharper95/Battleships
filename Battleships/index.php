<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.11
*
* V0.1      Nick    01/10/16    initial creation
* V0.11     Nick    13/10/16    now checks to see if user is logged in, and sends to home page
*
**/

    require_once("Content/Classes/setup.php");

    //header("location: Content/Pages/game.php");
    //exit();

    // check the user is logged in by checking the session variable
if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: Content/Pages/login.php");
    exit();
} else {
    header("Location: Content/Pages/home.php");
    exit();
}

?>