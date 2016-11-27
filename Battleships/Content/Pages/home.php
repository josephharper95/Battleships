<?php

/*
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    13/10/16    initial creation
* V0.11     Nick    09/11/16    page redirection bug
* V0.12     Nick    10/11/16    changed home text
* V1.0      Nick    27/11/16    updated for new design
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
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
</head>
<body>

    <div id="pageHomeCont">
        <div id="pageHome">

            <a href="statistics.php" 
                class="pageIcon statistics"
                title="View your Statistics"></a>

            <a href="multiplayer.php"
                class="pageIcon multiplayer"
                title="Battle in Multiplayer"></a>

            <a href="game.php"
                class="pageIcon computer"
                title="Battle the Computer"></a>

            <a href="logout.php"
                class="pageIcon logout"
                title="Logout of the application"></a>

            <div class="logo"></div>
            <a href="http://twitter.com" 
                class="twitter socialMedia"
                target="_blank"></a>
            <a href="https://www.facebook.com/battleships.online" 
                class="facebook socialMedia"
                target="_blank"></a>
            <a href="http://youtube.com" 
                class="youtube socialMedia"
                target="_blank"></a>
        </div>
    </div>

</body>
</html>

<?php

require_once("footer.php");

?>