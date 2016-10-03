<?php
    //http://www.datagenetics.com/blog/december32011/
    require("../Classes/setup.php");

    //Session::set("userID", "user"); //dummy user for developers without DB setup.
    
    if(Session::get("userID")) // If user is already logged in on a session... go to game!
    {
        header("Location: game.php");
        exit();
    }
    
    if(Input::itemExists("register"))
    {
        header("Location: registration.php");
        exit();
    }

    if(Input::itemExists("userID") && Input::itemExists("password") && Input::itemExists("login")) // If user has entered a username and password
    {
        $userID = Input::post("userID");
        $hashedPassword = hash("sha256", Input::post("password"));
        $db = Database::getInstance();
        $db->checkForUserAndPassword($userID, $hashedPassword);

        $user = $db->getUserByID($userID)[0];

        if($db->getRowCount() > 0) // If username + hashed password combination is found in the DB... go to game!
        {
            Session::set("userID", $userID);
            Session::set("firstName", $user->firstName);
            Session::set("lastName", $user->lastName);
            
            header("Location: game.php");
            exit();
        }
        else // If username + hashed password combination not found in the DB... redirect back to login page.
        {
            Session::set("loginMessage", "The entered username and password combination could not be found.");
            header("Location: login.php");
            exit();
        }
    }
    require("header.php");

    if(Session::exists("loginMessage"))
	{
		echo Session::get("loginMessage");
		Session::delete("loginMessage");
	}
?>

<form method="post" 
      action=""
      id="loginForm">
	<fieldset>
	    <legend>User Login</legend>
	    <ul class="blank">
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

    <div class="registrationExtra">
        <i>Need an account?</i>
		<input type="submit" 
               name="register" 
               value="Register Now"
               class="button" />
	</div>
</form>

<?php
        require("footer.php");
?>