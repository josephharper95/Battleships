<?php

/**
*
*   V0.1    Joe    17/01/17    initial creation
*   
*/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check if the user is logged in by checking the session variable
if(Session::get("userID")) {

    // redirect to home page if user is logged in already
    header("Location: home.php");
    exit();
}

if(Input::itemExists("passwordSetAttempt"))
{
    if (Input::itemExists("newPassword") && 
        Input::itemExists("passwordMatch") && 
        Input::post("newPassword") && 
        Input::itemExists("userID")) {

        if (Input::post("newPassword") == Input::post("passwordMatch")) {

            $userQuery = new User();
            $userID = Input::post("userID");
            $newHashedPassword = hash("sha256", Input::post("newPassword"));

            // Delete reset code/user id combination from db
            $userQuery->deletePendingPasswordReset($userID);
            $userQuery->updatePasswordByUserID($userID, $newHashedPassword);
            Session::set("loginMessage", "Password change successful. Please enter your username and password to log in.");
            header("Location: login.php");
            exit();
        } else {

            Session::set("confirmPasswordResetMessage", "Please ensure both the new password and confirm password entries match.");
        }
    } else {

        Session::set("confirmPasswordResetMessage", "Please ensure you have entered data in all the fields");
    }
}

if (Input::getItemExists("userID") && Input::getItemExists("resetCode"))
{
    $userID = Input::get("userID");
    $resetCode = Input::get("resetCode");

    $userQuery = new User();

    $rows = $userQuery->checkForPendingPasswordReset($userID, $resetCode);
    if($userQuery->db->getRowCount() > 0)
    {
        // Allow user to reset their password
?>
        <h1>Reset Password</h1>

        <form method="post" action="">

            <ul class="blank">
                <li>
                    <input type="password" placeholder="New Password" name="newPassword" />
                </li>
                <li>
                    <input type="password" placeholder="Confirm New Password" name="passwordMatch" />
                </li>
                <li>
                    <button type="submit" name="passwordSetAttempt"> Set New Password </button>
                </li>
                <input type="hidden" name="userID" value=<?= $userID?> />

                <li class="confirmPasswordResetError">
                    <?= Session::get("confirmPasswordResetMessage"); ?>
                </li>
            </ul>
        </form>


<?php        
    }
    else
    {
        Session::set("loginMessage", "No pending password request found.");
        header("Location: login.php");
    }
}
else
{
    Session::set("loginMessage", "No reset code provided.");
    header("Location: login.php");
}

?>

<?php
Session::delete("confirmPasswordResetMessage");
?>