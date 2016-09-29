<?php
//Start the current session
session_start();

//Autoloads the classes so that they can be instantiated easily in other pages.
spl_autoload_register(function($className) {
    require('$className' . '.php');
});

//include errors for now
error_reporting(E_ALL); 
ini_set('display_errors', 1);
?>