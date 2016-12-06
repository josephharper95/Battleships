<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    03/10/16    initial creation
* V0.11     Nick    04/10/16    changed javascript redirect to php redirect
*
**/

// include setup if it hasn't already been included
require_once("../Classes/setup.php");

// destroy the session
session_regenerate_id();
session_destroy();

// reroute user back to login page
header("location: login.php");

?>