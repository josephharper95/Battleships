<?php

/**
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.22
*
* V0.1      Joe     01/10/16    initial creation
* V0.2      Nick    03/10/16    added session variables
* V0.21     Joe     06/10/16    Added comments, moved message to formatted tags
* V0.22     Nick    13/10/16    changed successful login to point to index.php rather than game.php
* V0.23     Joe     21/10/16    altered code to reflect addition of User class
* V0.24     Nick    10/11/16    updated redirection
* V1.0      Nick    27/11/16    updated for new design
* V1.1      Nick    01/12/16    social media links now brought in from file
* V1.11     Nick    06/12/16    style tweaks
*
**/

//http://www.datagenetics.com/blog/december32011/
require_once("../Classes/setup.php");

if (Session::get("userID")) { // If user is already logged in on a session... go to game!
    header("Location: ../../index.php");
    exit();
}

if (Input::itemExists("register")) {
    header("Location: registration.php");
    exit();
}

if(Input::itemExists("userID") && Input::itemExists("password")) { // If user has entered a username and password
    $userID = Input::post("userID");
    $hashedPassword = hash("sha256", Input::post("password"));
    $userQuery = new User();
    $userQuery->checkForUserAndPassword($userID, $hashedPassword);

    if($userQuery->db->getRowCount() > 0) { // If username + hashed password combination is found in the DB... go to game!
        $user = $userQuery->getUserByID($userID)[0];

        Session::set("userID", $user->userID); // Setting the user in the session allows them to play the game
        Session::set("firstName", $user->firstName);
        Session::set("lastName", $user->lastName);
        
        session_regenerate_id();

        header("Location: ../../index.php");
        exit();

    } else { // If username + hashed password combination not found in the DB... redirect back to login page.
        Session::set("loginMessage", "The entered username and password combination could not be found.");
        //header("Location: login.php");
        //exit();
    }
}

//require_once("header.php"); // Runs header.php file
//Session::set("loginMessage", "The entered username and password combination could not be found.");
?>

<html>
<head>
    <title>BattleShips Online - Login</title>
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="../../Scripts/Pages/login.js"></script>
</head>
<body>

    <div id="pageLoginCont">

        <div id="pageLogin"
<?php
    if (Session::exists("loginMessage")) {
        echo "class='extra'";
    }
?>
        >

            <h1>BattleShips Online</h1>

            <form method="post"
                    action="">

                    <ul class="blank">

                        <li>
                            <input type="text"
                                    placeholder="Username"
                                    name="userID" />
                        </li>

                        <li>
                            <input type="password"
                                    placeholder="Password"
                                    name="password" />
                        </li>

                        <li style="text-align:right;">
                            <button type="submit">
                                Login!
                            </button>
                        </li>

                        <li class="notRegistered">
                            <i>
                                Need an account?
                                <a href="registration.php">Register Now</a>
                            </i>
                        </li>

                        <li class="loginError">
                            <?= Session::get("loginMessage"); ?>
                        </li>

                    </ul>

            </form>

            <div class="logoCont">

                <div class="logo"></div>

<?php
                require("socialMedia.php");
?>

            </div>
        </div>

    </div>

    <audio id="typewriter"
            preloader="auto">
        <source src="../Sounds/typewriter.mp3" />
    </audio>

</body>
</html>

<?php 
    Session::delete("loginMessage");
?>