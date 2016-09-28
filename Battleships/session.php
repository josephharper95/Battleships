<?php
    session_start();

    function getSession()
    {
        return $_SESSION;
    }

    function getSessionVariable(variableName)
    {
        if($_SESSION[variableName])
        {
            return $_SESSION[variableName];
        }
        else
        {
            return false;
        }
    }
?>