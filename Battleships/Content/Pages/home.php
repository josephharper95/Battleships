<?php

/*
*
* V0.1      Nick    13/10/16    initial creation
* V0.11     Nick    09/11/16    page redirection bug
* V0.12     Nick    10/11/16    changed home text
* V1.0      Nick    27/11/16    updated for new design
* V1.1      Nick    01/12/16    updated to textual links on home page
* V1.11     Nick    05/12/16    updated text to statistics
* V1.12     Nick    12/12/16    added individual css file
*
*/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

//require_once("header.php");

?>

<html>
<head>
    <title>BattleShips Online - Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
    <link rel="stylesheet" type="text/css" href="../Styles/Pages/home.css" />
</head>
<body>

    <div id="pageHomeCont">
        <div id="pageHome">

            <h1>BattleShips Online</h1>

            <div class="poster statistics"></div>
            <div class="poster multiplayer"></div>
            <div class="poster computer"></div>

            <a href="logout.php"
                class="pageIcon logout"
                title="Logout of the application"></a>

            <ul id="menu"
                class="blank">

                <li>
                    <a href="game.php">Battle in Single-Player</a>
                </li>

                <li>
                    <a href="multiplayer.php">Battle in Multi-Player</a>
                </li>

                <li>
                    <a href="statistics.php">View your Statistics</a>
                </li>

            </ul>

            <div class="logo"></div>

<?php
    require("socialMedia.php");
?>
        </div>
    </div>

</body>
</html>

<?php

require_once("footer.php");

?>