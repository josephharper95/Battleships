<?php

/**
*
* Last Modified By: Joe Harper
* Current Version: 0.2
*
* V0.1      Joe  	01/10/16    initial creation
* V0.2 		Nick 	03/10/16 	added first / last name
* V0.21     Joe     06/10/16    added comments, moved message to formatted tags
* V0.22     Joe     21/10/16    altered code to reflect movement of user queries to User class from Database class
*
**/

	require_once("../Classes/setup.php");

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

					$userQuery = new User();
					$userQuery->getUserByID($userID);
					if($userQuery->db->getRowCount() > 0) { // If the user already exists in the database... error

						Session::set("registrationMessage", "That username is taken, please pick another.");
						header("Location: registration.php");
						exit();
					} else { // No issues with input, user inserted into DB and redirected

						$userQuery->insertNewUser($userID, $hashedPassword, $firstName, $lastName);
						Session::set("loginMessage", "User successfully registered. Enter your credentials to log in.");
						header("Location: login.php");
						exit();
					}
				} else { // Password fields did not match, redirect back to registration page with error

					Session::set("registrationMessage", "Please ensure both your password fields match.");
					header("Location: registration.php");
					exit();
				}
			} else { // Username wasn't between 1-12 characters, redirect back to registration page with error'

				Session::set("registrationMessage", "Please ensure your username is between 1 and 12 characters long.");
				header("Location: registration.php");
				exit();
			}
		} else { // Not every field had an input, redirect back to registration page with error

			Session::set("registrationMessage", "Please ensure every field has an input.");
			header("Location: registration.php");
			exit();
		}
    }
    
    require_once("header.php");
?>

<form method="post" 
	  action=""
	  id="registrationForm">
	<fieldset>
		<legend>User Registration</legend>
		<ul class="blank"> <!-- Registration field for the users -->
		<?php
			if(Session::exists("registrationMessage"))
			{
				echo Session::get("registrationMessage")."<br><br>";
				Session::delete("registrationMessage");
			}
		?>	
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
	<div class="registrationExtra"> <!-- Return to login screen button -->
		<i>Already registered?</i>
		<input type="submit" 
			   name="return" 
			   value="Return to Login Screen"
			   class="button"/>
	</div>
</form> 

<?php
    require_once("footer.php"); // Included footer script in file
?>