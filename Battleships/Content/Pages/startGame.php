<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick        13/10/16    initial creation
*
**/

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

    <h1>Start Game</h1>

    <div class="container" style="text-align:center;">

        <i>Before you start your game, choose your difficulty and board size!</i>

        <form action="game.php" method="POST">
            <div>

                <ul class="blank left">

                    <li>
                        <b>Difficulty</b>
                    </li>

                    <li>
                        <label>Easy</label>
                        <input type="radio" name="difficulty" value="easy" checked />
                    </li>

                    <li>
                        <label>Medium</label>
                        <input type="radio" name="difficulty" value="medium" />
                    </li>

                    <li>
                        <label>Hard</label>
                        <input type="radio" name="difficulty" value="hard" disabled />
                    </li>

                </ul>

                <ul class="blank right">

                    <li>
                        <b>Board Size</b>
                    </li>

                    <li>
                        <label>Small (10x10)</label>
                        <input type="radio" name="size" value="small" checked />
                    </li>

                    <li>
                        <label>Medium (15x15)</label>
                        <input type="radio" name="size" value="medium" disabled />
                    </li>

                    <li>
                        <label>Large (20x20)</label>
                        <input type="radio" name="size" value="large" disabled />
                    </li>

                </ul>

            </div>

            <button class="button" 
                    style="clear:both;"
                    type="submit">
                Start!
            </button>

        </form>
    </div>
</div>

<?php

require_once("footer.php");

?>