<?php

/*
*
* V0.1      Nick    13/10/16    initial creation
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

<link rel="stylesheet" type="text/css" href="../Styles/Pages/medals.css" />

<div id="pageMedalsCont"
        class="pageContainer">

    <div id="pageMedals">

        <ul class="blank">

            <li>

                <div class="medal"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Win an Easy game in Single-Player
                </div>
            </li>

            <li>

                <div class="medal"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Win a Medium game in Single-Player
                </div>
            </li>

            <li>

                <div class="medal locked"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Win a Hard game in Single-Player
                </div>
            </li>

            <li>

                <div class="medal locked"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Win a game in Multi-Player
                </div>
            </li>

            <li>

                <div class="medal"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Achieve an Accuracy of 75% or more on a Small board
                </div>
            </li>

            <li>

                <div class="medal locked"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Achieve an Accuracy of 65% or more on a Medium board
                </div>
            </li>

            <li>

                <div class="medal"></div>
                <br/>
                <div class="shelf"></div>
                <br/>
                <div class="blackboard">
                    Achieve an Accuracy of 55% or more on a Large board
                </div>
            </li>
        </ul>

    </div>

</div>