<?php 
    require_once("../Classes/setup.php");
?>

<!DOCTYPE html>
<html>
<head>
    <title>BattleShips!</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
</head>

<body>
    <div id="header">
        
        <div id="headerBar">
             
            <h1 id="headerTitle">BattleShips</h1>

            <div id="userDetails">
                <div id="firstName"><?= Session::get("firstName"); ?></div>
                <div id="lastName"><?= Session::get("lastName"); ?></div>
            </div>

        </div>

    </div>

    <div class="body">