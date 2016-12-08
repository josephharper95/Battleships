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
* V1.0 		Nick 	27/11/16 	updated for new design
* V1.1 		Nick 	06/12/16 	added social media links
*
**/

require_once("../Classes/setup.php");

if (Input::itemExists("return")) { // If user selected "Return to Login Screen"

	header("Location: login.php");
	exit();
}

if (Input::itemExists("register")) {

	if (Input::itemExists("username") && Input::itemExists("firstName") && Input::itemExists("lastName") && Input::post("password") && Input::itemExists("passwordMatch")) {

		$userID = trim(Input::post("username"));
		if(preg_match("/^[a-zA-Z0-9\.\_\-]{1,20}$/", $userID)) { // If username is alphanumeric and 1-20 characters long

			$firstName = Input::post("firstName");
			$lastName = Input::post("lastName");
			if(preg_match("/^[a-zA-Z0-9\'\-]{1,50}$/", $firstName) && preg_match("/^[a-zA-Z0-9\'\-]{1,50}$/", $lastName)) {

				if(Input::post("password") === Input::post("passwordMatch")) {

					$hashedPassword = hash("sha256", Input::post("password"));

					$userQuery = new User();
					$userQuery->getUserByID($userID);
					if($userQuery->db->getRowCount() > 0) { // If the user already exists in the database... error

						Session::set("registrationMessage", "That username is taken, please pick another.");
						//header("Location: registration.php");
						//exit();
					} else { // No issues with input, user inserted into DB and redirected

						$userQuery->insertNewUser($userID, $hashedPassword, $firstName, $lastName);
						Session::set("loginMessage", "User successfully registered. Enter your credentials to log in.");
						header("Location: login.php");
						exit();
					}
				} else { // Password fields did not match, redirect back to registration page with error

					Session::set("registrationMessage", "Please ensure both your password fields match.");
					//header("Location: registration.php");
					//exit();
				}
			} else {
				Session::set("registrationMessage", "Please ensure your first name and last name are up to 50 characters long and do not contain special characters.");
			}
		} else { // Username wasn't between 1-20 characters, redirect back to registration page with error'

			Session::set("registrationMessage", "Please ensure your username is between 1 and 20 characters long.");
			//header("Location: registration.php");
			//exit();
		}
	} else { // Not every field had an input, redirect back to registration page with error

		Session::set("registrationMessage", "Please ensure every field has an input.");
		//header("Location: registration.php");
		//exit();
	}
}

?>

<html>
<head>
    <title>BattleShips Online - Login</title>
    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
    <script type="text/javascript" src="../../Scripts/jquery.min.js"></script>
    <script type="text/javascript" src="../../Scripts/Pages/registration.js"></script>
</head>
<body>

	<div id="pageRegistrationCont">

        <div id="pageRegistration"
<?php
    if (Session::exists("registrationMessage")) {
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
								name="username"
								<?= Input::itemExists("username") ? "value='" . Input::post("username") . "'" : ""; ?>
								 />
					</li>

					<li>
						<input type="text"
								placeholder="Forename(s)"
								name="firstName"
								<?= Input::itemExists("firstName") ? "value='" . Input::post("firstName") . "'" : ""; ?>
								 />
					</li>

					<li>
						<input type="text"
								placeholder="Surname"
								name="lastName"
								<?= Input::itemExists("lastName") ? "value='" . Input::post("lastName") . "'" : ""; ?>
								 />
					</li>

					<li>
						<input type="password"
								placeholder="Password"
								name="password" />
					</li>

					<li>
						<input type="password"
								placeholder="Confirm Password"
								name="passwordMatch" />
					</li>

					<li style="text-align:right;">
						<button type="submit"
								name="register">
							Register!
						</button>
					</li>

					<li class="alreadyRegistered">
						<i>
							Already Registered?
							<a href="login.php">Login Here</a>
						</i>
					</li>

					<li class="registrationError">
						<?= Session::get("registrationMessage"); ?>
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
    Session::delete("registrationMessage");
?>