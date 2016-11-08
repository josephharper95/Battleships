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

<!--<script src="http://52.18.77.251:3000/socket.io/socket.io.js"></script>-->
<script type="text/javascript" src="http://cdn.socket.io/socket.io-1.0.3.js"></script>
<!--<script src="/socket.io/socket.io.js"></script>-->
<script src="../../Scripts/Pages/startMultiplayer.js" type="text/javascript"></script>

<div id="pageStartMultiplayer"
     class="standardWidth">
    
    <h1>Multiplayer</h1>

    <ul id="availableRooms"
        class="blank">

    </ul>

</div>