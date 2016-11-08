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

<script src="http://ec2-52-18-77-251.eu-west-1.compute.amazonaws.com:3000/socket.io/socket.io.js"></script>
<!--<script src="/socket.io/socket.io.js"></script>-->
<script src="../../Scripts/Pages/startMultiplayer.js" type="text/javascript"></script>

<div id="pageStartMultiplayer"
     class="standardWidth">
    
    <h1>Multiplayer</h1>

    <ul id="availableRooms"
        class="blank">

    </ul>

</div>