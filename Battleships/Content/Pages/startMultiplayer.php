<?php

/**
*
* Last Modified By: Nick Holdsworth
*
* V0.1  Nick    07/11/16    initial creation
*
*/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: Content/Pages/login.php");
    exit();
}

require_once("header.php");

?>

<div id="pageStartMultiplayer">
    
    <h1>Multiplayer</h1>

</div>