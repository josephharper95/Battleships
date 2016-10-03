<!--
*
* Last Modified By: Dave MacDonald
* Current Version: 0.1
*
* V0.1      Dave    01/10/16    initial creation
*
-->

<?php
//Start the current session
session_start();

//Autoloads the classes so that they can be instantiated easily in other pages.
spl_autoload_register(function($className) {
    require($className . '.php');
});

//include errors for now
error_reporting(E_ALL); 
ini_set('display_errors', 1);
?>