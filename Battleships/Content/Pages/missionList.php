<?php

/**
*
* V0.1  Nick    10/12/16    initial creation
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

<link rel="stylesheet" type="text/css" href="../Styles/Pages/missionList.css" />

<div id="pageMissionListCont"
        class="pageContainer">

    <div id="pageMissionList">

        <h1>Missions</h1>

        <p>Insert schpiel about what missions are, bit of WW2 style...</p>

        <table id="missions">

            <tr>
                <td>
                    <i class="fog"></i>
                </td>
                <td>
                    <h3>Fog of War</h3>

                    <p>
                        You have lost communications with your allies on shore. 
                        Your sonar system has been damaged by a recent attack so you are unaware if you have sunk your enemy ships.
                        You will need to re-align your strategy to ensure that you defeat the enemy before they beat you!
                    </p>
                </td>
                <td>
                    <form action="game.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="fogOfWar" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>
                    <i class="hardcore"></i>
                </td>

                <td>
                    <h3>Hardcore</h3>

                    <p>
                        You have suffered a tremendous hit.
                        None of your perks are available anymore.
                        Only your main cannon works.
                        You need to choose your shots wisely without your extra abilities.
                        Good luck!
                    </p>
                </td>

                <td>
                    <button>
                        Battle
                    </button>
                </td>
            </tr>

            <tr>
                <td></td>

                <td>
                    <h3>Last - Stand</h3>

                    <p>
                        Only your destroyer survived the last attack.
                        You're in the ocean... alone.
                        A new full wave of enemy ships is fast approaching you.
                        Position your ship to fend off the enemy.
                    </p>
                </td>
                
                <td>
                    <button>
                        Battle
                    </button>
                </td>
            </tr>
        </table>
    </div>
</div>