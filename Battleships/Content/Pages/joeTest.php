<?php
    require("..\Classes\setup.php");

    $userID = "user";
    $hashedPassword = hash("sha256", "password");

    $db = Database::getInstance();
    $db->checkForUserAndPassword($userID, $hashedPassword);

    if($db->getRowCount() > 0) // If username + hashed password combination is found in the DB... go to game!
    {
        Session::set("userID", $userID);
        header("Location: game.php");
        exit();
    }
?>