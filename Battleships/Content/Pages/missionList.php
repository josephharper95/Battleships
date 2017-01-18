<?php

/**
*
* V0.1      Nick    10/12/16    initial creation
* V0.2      Nick    19/12/16    updates to mission list to go to new page
* V0.21     Ncik    21/12/16    slight wording tweaks
* V0.3      Nick    21/12/16    added rest of missions
* V0.4      Nick    10/01/17    added icons
* V0.41     Nick    17/01/17    fixed issue with naming
* V0.5      Nick    18/01/17    mission text removed for a cleaner look
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
                </td>
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="fog-of-war" />

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
                </td>

                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="hardcore" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>
                    <i class="last-stand"></i>
                </td>

                <td>
                    <h3>Last - Stand</h3>
                </td>
                
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="last-stand" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>
                    <i class="against-the-clock"></i>
                </td>

                <td>
                    <h3>Against the Clock</h3>
                </td>
                
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="against-the-clock" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>
                    <i class="pearl-harbour"></i>
                </td>

                <td>
                    <h3>Pearl Harbour</h3>
                </td>
                
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="pearl-harbour" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>
                    <i class="island-warfare"></i>
                </td>

                <td>
                    <h3>Island Warfare</h3>
                </td>
                
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="island-warfare" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>

            <!--<tr>
                <td>
                    <i class="waves"></i>
                </td>

                <td>
                    <h3>Waves</h3>
                </td>
                
                <td>
                    <form action="mission.php"
                            method="POST">

                        <input type="hidden"
                                name="missionName"
                                value="waves" />

                        <button type="submit"
                                value="mission">
                            Battle
                        </button>
                    </form>
                </td>
            </tr>-->
        </table>
    </div>
</div>