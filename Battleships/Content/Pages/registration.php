<?php
	require("../Classes/setup.php");
    if(Input::itemExists("return")) // If user selected "Return to Login Screen"
    {
        header("Location: login.php");
        exit();
    }

	if(Input::itemExists("register"))
    {
        if(Input::itemExists("username") && Input::post("password") && Input::itemExists("passwordMatch"))
		{
			$userID = trim(Input::post("username"));
			if(preg_match('/^[a-zA-Z0-9]{1,12}$/', $userID)) // If username is alphanumeric and 1-12 characters long
			{
				if(Input::post("password") === Input::post("passwordMatch"))
				{
					$hashedPassword = hash("sha256", Input::post("password"));

					$db = Database::getInstance();
					$db->getUserByID($userID);
					if($db->getRowCount() > 0)
					{
						Session::set("registrationMessage", "That username is taken, please pick another.");
						header("Location: registration.php");
						exit();
					}
					else
					{
						$db->insertNewUser($userID, $hashedPassword);
						header("Location: login.php");
						exit();
					}
				}
				else
				{
					Session::set("registrationMessage", "Please ensure both your password fields match.");
					header("Location: registration.php");
					exit();
				}
			}
			else
			{
				Session::set("registrationMessage", "Please ensure your username is between 1 and 12 characters long.");
				header("Location: registration.php");
				exit();
			}

		}
		else
		{
			Session::set("registrationMessage", "Please ensure every field has an input.");
			header("Location: registration.php");
			exit();
		}
    }
    
    require("header.php");

	if(Session::exists("registrationMessage"))
	{
		echo Session::get("registrationMessage");
		Session::delete("registrationMessage");
	}
?>
<form method='post' action=''>
	<fieldset>
	<legend>User Registration</legend>
	<div>
		Username: <input type='text' name='username'/><br/>
		Password: <input type='password' name='password'/><br/>
		Confirm Password: <input type='password' name='passwordMatch'/><br/>
		<input type='submit' name='register' value='Register'/><br/>
	</div>
	</fieldset>
	<div>
		<input type='submit' name='return' value='Return to Login Screen'/><br/>
	</div>
</form> 

<?php
    require("footer.php");
?>