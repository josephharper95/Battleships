<?php require_once("../Classes/setup.php"); ?>

<!--
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/10/16    initial creation
*
-->

<!DOCTYPE html>
<html>
<head>
    <title>BattleShips!</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
</head>

<body>
    <div id="header">
        
        <div id="headerBar">
             
            <h1 id="headerTitle">BattleShips</h1>

<?php

if (Session::exists("userID")) {

?>

            <div id="userDetails">
                <div id="firstName"><?= Session::get("firstName"); ?></div>
                <div id="lastName"><?= Session::get("lastName"); ?></div>
                
                <div class="logout">
                    <i>Not you?</i>
                    <a href="logout.php">Logout</a>
                </div>
            </div>

<?php

}

?>

        </div>

    </div>

    <div class="body">