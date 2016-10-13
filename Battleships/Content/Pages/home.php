<?php

/*
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    13/10/16    initial creation
*
*/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: Content/Pages/login.php");
    exit();
}

require_once("header.php");

?>


<div id="pageHome" class="standardWidth">

    <h1>Home</h1>

    <br/><br/>

    Insert schpiel about how some sicko coders created an online version of BattleShips that will literally rock your cock off.

</div>

<?php

require_once("footer.php");

?>