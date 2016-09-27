<?php
    session_start(); // Indicates we are using a session
    $_SESSION["userID"] = "dummy";
    
    if($_SESSION["userID"])
    {
        header("Location: Content/Pages/game.php");
        exit();
    }
    
    if($_POST["password"] && $_POST["userID"])
    {
        // use post variables to check against DB
    }

    //http://www.datagenetics.com/blog/december32011/
?>