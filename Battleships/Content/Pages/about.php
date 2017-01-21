<?php

/**
*
* V0.1      Nick    10/12/16    initial creation
* V0.11     Nick    22/12/16    responsiveness fix
* V0.12     Nick    28/12/16    spelling mistake
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

<link rel="stylesheet" type="text/css" href="../Styles/Pages/about.min.css" />

<div id="pageAboutCont"
        class="pageContainer">

    <div id="pageAbout">

        <div>

            <h1>About</h1>

            <p>Insert schpiel about what we have created and why we have created it.</p>

            <div id="releaseNotes">

                <h2>Release Notes</h2>

                <h3>V2.0.0</h3>

                <p>
                    Our second release includes the following:
                    <ul>
                        <li>
                            Multi-Player
                        </li>
                        <li>
                            Statistics    
                        </li>
                        <li>
                            Scoring    
                        </li>
                        <li>
                            Perks
                        </li>
                    </ul>
                    That's right! You can now battle against your friends on different sized boards in our new multiplayer mode.
                    You can create a room for them to join, or you can battle against anyone in the world!
                    We have implemented a scoring model so that you can see if you are improving in your strategy.
                    All new statistics tracking means you can now see how good you are across all difficulties. 
                    Public leadboards allow you to take pride, or shame, in your score.
                </p>

                <h3>V1.0.0</h3>

                <p>
                    This is our first release! Challenge our AI in Single-Player and see how well you do!
                </p>

            </div>
        </div>
    </div>
</div>

<?php

require_once("footer.php");

?>