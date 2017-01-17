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

if (Input::itemExists("changePassword")) 
{
    if(Input::itemExists("oldPassword") && Input::itemExists("newPassword") && Input::itemExists("passwordMatch") && Input::post("newPassword"))
    {
        if(Input::post("newPassword") === Input::post("passwordMatch")) 
        {
            $userQuery = new User();
            $userID = Session::get("userID");
            $hashedPassword = hash("sha256", Input::post("oldPassword"));
            $newHashedPassword = hash("sha256", Input::post("newPassword"));

            $userQuery->checkForUserAndPassword($userID, $hashedPassword); // Check to see if the entered password/username combination exists in the DB

            if($userQuery->db->getRowCount() > 0) // If the old entered password matches the one in the DB...
            {
                $userQuery->updatePasswordByUserID($userID, $newHashedPassword);

                Session::set("changePasswordMessage", "Password change successful.");
            }
            else
            {
                Session::set("changePasswordMessage", "Please ensure your old password is correct.");
            }
        }
        else
        {
            Session::set("changePasswordMessage", "Please ensure both the new password and confirm password entries match.");
        }
    }
    else
    {
        Session::set("changePasswordMessage", "Please ensure you have entered data in all the fields");
    }
}

// include the header file if it has not been included before
require_once("header.php");
?>

            <form method="post" action="">
                <li><input type="password" placeholder="Old Password" name="oldPassword"/></li>
                <li><input type="password" placeholder="New Password" name="newPassword" /></li>
                <li><input type="password" placeholder="Confirm New Password" name="passwordMatch" /></li>
                <li><button type="submit" name="changePassword"> Change Password </button></li>

                        <li class="changePasswordError">
                            <?= Session::get("changePasswordMessage"); ?>
                        </li>

                    </ul>

            </form>


<?php
Session::delete("changePasswordMessage");
?>