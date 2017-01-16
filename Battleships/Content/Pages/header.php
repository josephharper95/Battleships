<?php

/*
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.5
*
* V0.1      Nick                01/10/16    initial creation
* V0.11     Nick                04/10/16    menu doesn't show when user is not logged in
* V0.12     Nick                13/10/16    added start game options to menu
* V0.13     Nick                30/10/16    added statistics option
* V0.2      Nick                09/11/16    added waiting loader 
* V0.3      Nick / Dave / Joe   09/11/16    added offline / online
* V0.4      Nick                10/11/16    added extra loader HTML
* V0.41     Nick                10/11/16    renamed multiplayer pages
* V0.5      Nick                12/11/16    added version to header
* V0.51     Nick                15/11/16    rejigged loaders
* V0.6      Nick                02/12/16    added logo to header
* V0.7      Nick                07/12/16    added timeout message
* V0.8      Nick                10/12/16    added hamburger menu
* V0.9      Nick                11/12/16    added social media to header
* V1.0      Nick                22/12/16    hamburger menu is now static
* V1.1      Nick                28/12/16    moved menu into header
*
*/ 

require_once("../Classes/setup.php");

?>

<!DOCTYPE html>
<html>
<head>
    <title>BattleShips Online!</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- default files needed -->
    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="../../Scripts/app.js"></script>

    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />

    <?php
        require_once("favicon.html");
    ?>
</head>

<!-- Loader markup -->
<div id="waitingOverlay"></div>
<div id="waitingCont">
    <div id="waitingLoader"></div>
    <div id="waitingMessage"></div>
</div>

<div id="loaderOverlay"></div>
<div id="loaderCont">
    <div id="loader"></div></div>
</div>

<div id="messageTimeout">
    <h2>Message!</h2>
    <div id="message"></div>
</div>

<body>
    <div id="header">

        <div class="version">
            Version: 2.8.5
        </div>

        <div id="headerBar">
            <h1 id="headerTitle">BattleShips Online</h1>

            <div id="navigationHeaderHamburger"></div>

            <ul id="hamburgerMenu"
                class="blank">

                <li>
                    <a href="home.php">Home</a>
                </li>

                <li>
                    <a href="game.php">Battle in Single-Player</a>
                </li>

                <li>
                    <a href="missionList.php">Battle in Mission-Mode</a>
                </li>

                <li>
                    <a href="multiplayer.php">Battle in Multi-Player</a>
                </li>

                <li>
                    <a href="statistics.php">View your Statistics</a>
                </li>

                <li>
                    <a href="medals.php">Medal Cabinet</a>
                </li>

                <li>
                    <a href="help.php">Help</a>
                </li>

                <li>
                    <a href="about.php">About</a>
                </li>

            </ul>

            <div class="logo"></div>

            <div class="socialMedia">

<?php

include("socialMedia.php");

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

            </div>

            <div id="userDetails">

                <div id="firstName">
                    <?= Session::get("firstName"); ?>
                </div>

                <div id="lastName">
                    <?= Session::get("lastName"); ?>
                </div>

                <div id="playersOnline">
                    Offline
                </div>

            </div>
<?php

}

?>

        </div>
    </div>

    <div class="body">