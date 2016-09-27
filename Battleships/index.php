<?php
    session_start(); // Indicates we are using a session
    
    if($_SESSION["userID"])
    {
        header("Location: Content/Pages/game.php");
        exit();
    }
    
    if($_POST)

    //http://www.datagenetics.com/blog/december32011/
?>