<?php

/**
*
*   V0.1    Joe     17/01/17    initial creation
*   V0.2    Joe     18/01/17    added validation and true functionality
*   V0.3    Nick    21/01/17    styled
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

if(Input::itemExists("passwordSetAttempt")) // If user has clicked the "confirm new password" button
{
    if (Input::itemExists("newPassword") && 
        Input::itemExists("passwordMatch") && 
        Input::post("newPassword") && 
        Input::itemExists("userID")) { // If all the required fields are populated

        if (Input::post("newPassword") == Input::post("passwordMatch")) { // If the entered passwords match

            $userQuery = new User();
            $userID = Input::post("userID");
            $newHashedPassword = hash("sha256", Input::post("newPassword")); // Hash the new password for safety

            // Delete reset code/user id combination from db
            $userQuery->deletePendingPasswordReset($userID);
            $userQuery->updatePasswordByUserID($userID, $newHashedPassword); // Set new password for user in DB
            Session::set("loginMessage", "Password change successful. Enter your credentials to login.");
            header("Location: login.php");
            exit();
        } else {

            Session::set("confirmPasswordResetMessage", "Please ensure both the new password and confirm password entries match.");
        }
    } else {

        Session::set("confirmPasswordResetMessage", "Please ensure you have entered data in all the fields");
    }
}

if (Input::getItemExists("userID") && Input::getItemExists("resetCode")) { // If the user has clicked the reset link in the email

    $userID = Input::get("userID");
    $resetCode = Input::get("resetCode");

    $userQuery = new User();

    $rows = $userQuery->checkForPendingPasswordReset($userID, $resetCode); // Check to see if user id/reset code combination exists in DB

    if ($userQuery->db->getRowCount() > 0) { // if it does....
        // Allow user to reset their password
?>

<!DOCTYPE HTML>
<html>
<head>
    <title>BattleShips Online - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="../Styles/app.min.css" />
    <link rel="stylesheet" type="text/css" href="../Styles/Pages/confirmPasswordReset.min.css" />
</head>
<body>

    <div id="pageConfirmPasswordResetCont">

        <div id="pageConfirmPasswordReset"

    <?php
        if (Session::exists("confirmPasswordResetMessage")) {
            echo "class='extra'";
        }
    ?>

        >
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
        </div>
    </div>
</body>
</html>

<?php        

    } else {
        Session::set("loginMessage", "No pending password request found.");
        header("Location: login.php");
    }
} else {
    Session::set("loginMessage", "No reset code provided.");
    header("Location: login.php");
}

?>

<?php
Session::delete("confirmPasswordResetMessage");
?>