<?php

/*
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    13/10/16    initial creation
* V0.11     Nick    09/11/16    page redirection bug
* V0.12     Nick    10/11/16    changed home text
*
*/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

require_once("header.php");

?>


<div id="pageHome" class="standardWidth">

    <h1>Home</h1>

    <br/><br/>

    Insert schpiel.

</div>

<?php

require_once("footer.php");

?>