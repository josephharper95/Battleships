<?php

/**
*
* Last Modified By: Nick Holdsworth
*
* V0.1      Nick    07/11/16    initial creation
* V0.11     Nick    09/11/16    added pieces for creating / leaving
* V0.12     Nick    09/11/16    renamed to games rather than rooms
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

<script type="text/javascript" src="http://cdn.socket.io/socket.io-1.0.3.js"></script>

<script src="../../Scripts/Pages/startMultiplayer.js" type="text/javascript"></script>

<div id="pageStartMultiplayer"
     class="standardWidth">
    
    <h1 class="pageTitle">Multiplayer</h1>

    <button id="createGame">
        Create Room
    </button>

    <div class="clear"></div>

    <h3>Available Games</h3>

    <ul id="availableRooms"
        class="blank"></ul>

</div>