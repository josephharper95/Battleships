<?php

/*
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.12
*
* V0.1      Nick    01/10/16    initial creation
* V0.11     Nick    04/10/16    menu doesn't show when user is not logged in
* V0.12     Nick    13/10/16    added start game options to menu
* V0.13     Nick    30/10/16    added statistics option
* V0.2      Nick    09/11/16    added waiting loader 
*
*/ 

require_once("../Classes/setup.php");

?>

<!DOCTYPE html>
<html>
<head>
    <title>BattleShips Online!</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- default files needed -->
    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="../../Scripts/app.js"></script>

    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
</head>

<!-- Loader markup -->
<div id="waitingOverlay">
    <div id="waitingCont">
        <div id="waitingLoader"></div>
        <div id="waitingMessage">
            
        </div>
    </div>
</div>

<body>
    <div id="header">
        <div id="headerBar">
            <h1 id="headerTitle">BattleShips Online</h1>

<?php

// if the user is logged in, provide menu items
if (Session::exists("userID")) {

?>

<script type="text/javascript">
    var session = {
        id: <?= json_encode(Session::get("userID")); ?>,
        firstName: <?= json_encode(Session::get("firstName")); ?>,
        lastName: <?= json_encode(Session::get("lastName")); ?>
    };
</script>

            <ul class="blank"
            id="navigationHeader" >
            
                <li>
                    <a href="home.php">Home</a>
                </li>

                <li class="large">
                    <a href="startAIGame.php">Play Computer</a>
                </li>

                <li>
                    <a href="startMultiplayer.php">Multiplayer</a>
                </li>

                <li>
                    <a href="statistics.php">Statistics</a>
                </li>
            
                <li>
                    <a href="logout.php">Logout</a>
                </li>
            
            </ul>

            <div id="userDetails">
                <div id="firstName"><?= Session::get("firstName"); ?></div>
                <div id="lastName"><?= Session::get("lastName"); ?></div>
            </div>
<?php

}

?>

        </div>
    </div>

    <div class="body">