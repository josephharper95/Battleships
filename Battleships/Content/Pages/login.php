<?php
    //http://www.datagenetics.com/blog/december32011/
    require("..\Classes\setup.php");
    
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

        if($db->getRowCount() > 0) // If username + hashed password combination is found in the DB... go to game!
        {
            Session::set("userID", $userID);
            header("Location: game.php");
            exit();
        }
        else // If username + hashed password combination not found in the DB... redirect back to login page.
        {
            header("Location: login.php");
        exit();
        }
    }
    else // If user has not entered both username and password... display login form
    {
?>

<form method='post' action=''>
	<fieldset>
	<legend>User Login</legend>
	<div>
		Username: <input type='text' name='userID'/><br/>
		Password: <input type='password' name='password'/><br/>
		<input type='submit' name='login' value='Login'/>
	</div>
	</fieldset>
</form>
<form method='post' action='registration.php'>
	<div>
		<input type='submit' name='register' value='Register New User'/><br/>
	</div>
</form>
<?php
    }
?>