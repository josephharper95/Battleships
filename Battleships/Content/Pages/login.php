<?php
    require("..\Classes\setup.php");
    
    Session::set("userID", "dummy"); // Using false credentials to get into system prior to login implementation.
    
    if(Session::get("userID")) // If user is already logged in on a session... go to game!
    {
        header("Location: Content/Pages/game.php");
        exit();
    }
    
    if(Input::post("userID") && Input::post("password")) // If user has entered a username and password
    {
        $userID = Input::post("userID");

        $hashedPassword = hash("sha256", Input::post("password"));
        $db = Database::getInstance();
        $db.checkForUserAndPassword($userID, $hashedPassword);

        if($db.rowCount > 0) // If username + hashed password combination is found in the DB... go to game!
        {
            Session::set("userID", $userID);
            header("Location: game.php");
            exit();
        }
        else // If username + hashed password combination not found in the DB... redirect back to login page.
        {
            header("Location: login.php");
        exit();
        }
    }
    else // If user has not entered both username and password... redirect back to login page.
    {
        header("Location: login.php");
        exit();
    }


    //http://www.datagenetics.com/blog/december32011/
?>