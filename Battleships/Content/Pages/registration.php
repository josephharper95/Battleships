<?php
	require("../Classes/setup.php");

    if (Input::itemExists("return")) { // If user selected "Return to Login Screen"

        header("Location: login.php");
        exit();
    }

	if(Input::itemExists("register")) {

        if(Input::itemExists("username") && Input::itemExists("firstName") && Input::itemExists("lastName") && Input::post("password") && Input::itemExists("passwordMatch")) {

			$userID = trim(Input::post("username"));
			if(preg_match("/^[a-zA-Z0-9]{1,12}$/", $userID)) { // If username is alphanumeric and 1-12 characters long
			
				if(Input::post("password") === Input::post("passwordMatch")) {

					$hashedPassword = hash("sha256", Input::post("password"));
					$firstName = Input::post("firstName");
					$lastName = Input::post("lastName");

					$db = Database::getInstance();
					$db->getUserByID($userID);
					if($db->getRowCount() > 0) {

						Session::set("registrationMessage", "That username is taken, please pick another.");
						header("Location: registration.php");
						exit();
					} else {

						$db->insertNewUser($userID, $hashedPassword, $firstName, $lastName);
						header("Location: login.php");
						exit();
					}
				} else {

					Session::set("registrationMessage", "Please ensure both your password fields match.");
					header("Location: registration.php");
					exit();
				}
			} else {

				Session::set("registrationMessage", "Please ensure your username is between 1 and 12 characters long.");
				header("Location: registration.php");
				exit();
			}
		} else {

			Session::set("registrationMessage", "Please ensure every field has an input.");
			header("Location: registration.php");
			exit();
		}
    }
    
    require_once("header.php");

	if(Session::exists("registrationMessage"))
	{
		echo Session::get("registrationMessage");
		Session::delete("registrationMessage");
	}
?>

<form method="post" 
	  action=""
	  id="registrationForm">
	<fieldset>
		<legend>User Registration</legend>
		<ul class="blank">
			<li>
				<label for="username">Username:</label> 
				<input type="text" 
					   name="username"/>
			</li>
			<li>
				<label for="firstName">Forename(s):</label> 
				<input type="text" 
					   name="firstName"/>
			</li>
			<li>
				<label for="lastName">Surname:</label> 
				<input type="text" 
					   name="lastName"/>
			</li>
			<li>
				<label for="password">Password:</label> 
				<input type="password" 
					   name="password"/>
			</li>
			<li>
				<label for="passwordMatch">Confirm Password:</label>
				<input type="password" 
					   name="passwordMatch"/>
			</li>
			
			<input type="submit" 
				   name="register" 
				   value="Register"
				   class="button"/>
		</ul>
	</fieldset>
	<div class="registrationExtra">
		<i>Already registered?</i>
		<input type="submit" 
			   name="return" 
			   value="Return to Login Screen"
			   class="button"/>
	</div>
</form> 

<?php
    require_once("footer.php");
?>