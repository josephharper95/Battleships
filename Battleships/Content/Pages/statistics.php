<?php

/**
*
*   Last Modified By: Nick Holdsworth
*   Current Version: 0.1
*
*   V0.1    Nick    30/10/16    initial creation
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

<div id="pageStatistics" class="wideWidth">

    <h1>Statistics</h1>

    <?= Session::get("userID"); ?>

</div>