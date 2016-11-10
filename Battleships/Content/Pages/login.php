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

    if(Input::itemExists("userID") && Input::itemExists("password") && Input::itemExists("login")) { // If user has entered a username and password
        $userID = Input::post("userID");
        $hashedPassword = hash("sha256", Input::post("password"));
        $userQuery = new User();
        $userQuery->checkForUserAndPassword($userID, $hashedPassword);

        if($userQuery->db->getRowCount() > 0) { // If username + hashed password combination is found in the DB... go to game!
            $user = $userQuery->getUserByID($userID)[0];

            Session::set("userID", $user->userID); // Setting the user in the session allows them to play the game
            Session::set("firstName", $user->firstName);
            Session::set("lastName", $user->lastName);

            header("Location: ../../index.php");
            exit();

        } else { // If username + hashed password combination not found in the DB... redirect back to login page.
            Session::set("loginMessage", "The entered username and password combination could not be found.");
            header("Location: login.php");
            exit();
        }
    }

require_once("header.php"); // Runs header.php file

?>

<form method="post" 
      action=""
      id="loginForm">
	<fieldset><!-- Login form to allow user to enter their login details. -->
	    <legend>User Login</legend>
	    <ul class="blank">
        <?php
            if(Session::exists("loginMessage"))
        	{
	        	echo Session::get("loginMessage")."<br><br>";
	        	Session::delete("loginMessage");
	        }
        ?>
            <li>
				<label for="username">Username:</label> 
				<input type="text" 
					   name="userID"/>
			</li>

            <li>
				<label for="password">Password:</label> 
				<input type="password" 
					   name="password"/>
			</li>

		    <input type="submit" 
                   name="login" 
                   value="Login"
                   class="button"/>
	    </ul>
	</fieldset>

    <div class="registrationExtra"> <!-- Register button -->
        <i>Need an account?</i>
		<input type="submit" 
               name="register" 
               value="Register Now"
               class="button" />
	</div>
</form>

<?php
        require_once("footer.php"); // Runs the footer.php script
?>