<?php
    require("..\Classes\setup.php");
    
    Session::set("userID", "dummy");
    
    if(Session::get("userID"))
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