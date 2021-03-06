<?php

/**
*
*   V0.1    Joe    17/01/17    initial creation
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

if (Input::itemExists("changePassword"))  { // If the user clicked "change password"

    if (Input::itemExists("oldPassword") && 
        Input::itemExists("newPassword") && 
        Input::itemExists("passwordMatch") && 
        Input::post("newPassword")) { // If user has entered data in all the fields

        if (Input::post("newPassword") == Input::post("passwordMatch")) { // If the user passwords entered both match

            $userQuery = new User();
            $userID = Session::get("userID");
            $hashedPassword = hash("sha256", Input::post("oldPassword"));
            $newHashedPassword = hash("sha256", Input::post("newPassword")); // hash the input passwords for safety

            $userQuery->checkForUserAndPassword($userID, $hashedPassword); // Check to see if the entered password/username combination exists in the DB

            // If the old entered password matches the one in the DB... 
            if ($userQuery->db->getRowCount() > 0) {

                $userQuery->updatePasswordByUserID($userID, $newHashedPassword); // Set the new password
                Session::set("changePasswordMessage", "Password change successful.");
            } else {

                Session::set("changePasswordMessage", "Please ensure your old password is correct.");
            }
        } else {

            Session::set("changePasswordMessage", "Please ensure both the new password and confirm password entries match.");
        }
    } else {

        Session::set("changePasswordMessage", "Please ensure you have entered data in all the fields");
    }
}

// include the header file if it has not been included before
require_once("header.php");

?>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/changePassword.min.css" />

<div id="pageChangePasswordCont"
        class="pageContainer">

    <div id="pageChangePassword"

    <?php
        if (Session::exists("changePasswordMessage")) {
            echo "class='extra'";
        }
    ?>

    >

        <h1>Change Password</h1>

        <form method="post" action="">

            <ul class="blank">
                
                <li>
                    <input type="password" placeholder="Old Password" name="oldPassword"/>
                </li>

                <li>
                    <input type="password" placeholder="New Password" name="newPassword" />
                </li>

                <li>
                    <input type="password" placeholder="Confirm New Password" name="passwordMatch" />
                </li>

                <li>
                    <button type="submit" name="changePassword"> Change Password </button>
                </li>

                <li class="changePasswordError">
                    <?= Session::get("changePasswordMessage"); ?>
                </li>
            </ul>
        </form>
    </div>
</div>

<?php

require_once("footer.php");
Session::delete("changePasswordMessage");

?>