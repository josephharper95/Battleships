<?php

/**
*
* V0.1  Nick    10/12/16    initial creation
*
*/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check the user is logged in by checking the session variable
if(!Session::get("userID")) {

    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

// include the header file if it has not been included before
require_once("header.php");

?>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/help.css" />

<div id="pageHelpCont"
        class="pageContainer">

    <div id="pageHelp">

        <h1>Help</h1>

        <p>If you are struggling with understanding the game, we have provided a few videos and hints below. Alternatively, head to our YouTube page to find more.</p>

        <p>If you want to make a suggestion, please write on our Facebook page or Tweet us! We'd love to hear your feedback.</p>

        <h3>Here is a short tutorial...</h3>

        <div class="youtube">

            <iframe src="https://www.youtube.com/embed/FscQZ1LPt48" 
                    frameborder="0" 
                    allowfullscreen
                    style="display: inline-block;"></iframe>
        </div>
    </div>
</div>