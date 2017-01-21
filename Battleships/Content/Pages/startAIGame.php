<?php

/**
*
* V0.1      Nick    13/10/16    initial creation
* V0.11     Nick    13/10/16    enabled sizing options that were previously disabled
* V0.12     Nick    09/11/16    page redirection bug
* V0.2      Nick    29/11/16    changed start AI to be new design - PENDING HEADER
* V0.21     Nick    01/12/16    removed header from page
* V0.22     Nick    05/12/16    added button spacer
* V0.23     Nick    09/12/16    added responsive line
* V0.24     Nick    12/12/16    added individual CSS file
*
**/

require_once("../Classes/setup.php");

if(!Session::get("userID"))
{
    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

//require_once("header.php");

require_once("favicon.html");

?>

<html>
<head>
    <title>BattleShips Online - Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../Styles/app.min.css" />

    <link rel="stylesheet" type="text/css" href="../Styles/Pages/startAI.min.css" />
</head>
<body>

    <div id="pageStartAICont"
            class="pageContainer">

            <div id="pageStartAI">

                <h1>Single Player</h1>

                <form action="game.php" method="POST">
                    <div>

                        <ul class="blank left">

                            <li>
                                <b>Difficulty</b>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="easy" 
                                        name="difficulty"
                                        value="easy"
                                        checked />
                                <label for="easy">
                                    <span></span>
                                    Easy
                                </label>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="mediumDiff" 
                                        name="difficulty"
                                        value="medium" />
                                <label for="mediumDiff">
                                    <span></span>
                                    Medium
                                </label>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="hard" 
                                        name="difficulty"
                                        value="hard" />
                                <label for="hard">
                                    <span></span>
                                    Hard
                                </label>
                            </li>

                        </ul>

                        <ul class="blank right">

                            <li>
                                <b>Board Size</b>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="small" 
                                        name="size"
                                        value="small"
                                        checked />
                                <label for="small">
                                    <span></span>
                                    Small (10x10)
                                </label>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="medium" 
                                        name="size"
                                        value="medium" />
                                <label for="medium">
                                    <span></span>
                                    Medium (15x15)
                                </label>
                            </li>

                            <li>
                                <input type="radio" 
                                        id="large" 
                                        name="size"
                                        value="large" />
                                <label for="large">
                                    <span></span>
                                    Large (20x20)
                                </label>
                            </li>

                        </ul>
                        <br />

                        <a href="home.php">Home</a>

                        <div class="buttonSpacer"></div>

                        <button style="clear:both;"
                                type="submit">
                            Start!
                        </button>

                        <div class="logo"></div>

                    </div>

                </form>

            </div>

    </div>

</body>
</html>