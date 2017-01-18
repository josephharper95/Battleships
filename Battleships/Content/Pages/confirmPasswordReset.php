<?php

/**
*
*   V0.1    Joe    17/01/17    initial creation
*   
*/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check if the user is logged in by checking the session variable
if(Session::get("userID")) {

    // redirect to home page if user is logged in already
    header("Location: home.php");
    exit();
}

if (Input::getItemExists("userID") && Input::getItemExists("resetCode"))
{
    $userID = Input::get("userID");
    $resetCode = Input::get("resetCode");
    Session::set("confirmPasswordResetMessage", "Got the stuff");
}
else
{
    Session::set("loginMessage", "No reset code provided.");
    header("Location: login.php");
}

?>

<li class="confirmPasswordReset">
    <?= Session::get("confirmPasswordResetMessage"); ?>
</li>