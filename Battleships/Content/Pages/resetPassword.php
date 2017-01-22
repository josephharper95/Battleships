<?php

/**
*
*   V0.1    Joe    17/01/17    initial creation
*   V0.2    Joe    18/01/17    updated with queries and email
*   V0.21   Joe    18/01/17    updated email address
*   V0.22   Joe    18/01/17    added validation
*   V0.3    Nick   18/01/17    made it pretty
*   V0.4    Joe    19/01/17    moved mail method out to mail.php, made call asynchronous
*   
*/

// include the setup file if it has not been included
require_once("../Classes/setup.php");

// check if the user is logged in by checking the session variable
if (Session::get("userID")) {
    // redirect to home page if user is logged in already
    header("Location: home.php");
    exit();
}

if (Input::itemExists("resetPassword")) {

    $userID = trim(Input::post("userID"));

    // If username is alphanumeric and 1-20 characters long
    if ( preg_match("/^[a-zA-Z0-9\.\_\-]{1,20}$/", $userID)) { 
        
        $userQuery = new User();
        $rows = $userQuery->getUserByID($userID);

        if ($userQuery->db->getRowCount() > 0) { // Get the user into an object row

            foreach ($rows as $row) { // set up variables

                $emailAddress = $row->emailAddress;
                $firstName = $row->firstName;
                $lastName = $row->lastName;
            }

            $resetCode = generateResetCode(8); // Generate reset code to insert into DB
            $userQuery->insertPendingPasswordReset($userID, $resetCode); //

            pclose(popen("start /b php mail.php {$userID} {$firstName} {$lastName} {$emailAddress} {$resetCode}", "r")); // Asynchronously send user email
            Session::set("resetPasswordMessage", "Please check your emails and click the password reset link");

        } else {

            Session::set("resetPasswordMessage", "No user found with that user ID");
        }
    } else {

        Session::set("resetPasswordMessage", "Enter a valid user");
    }
} else {

    Session::set("resetPasswordMessage", "Please enter a valid user ID");
}

?>

<!DOCTYPE HTML>
<html>
<head>
    <title>BattleShips Online - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="../Styles/app.min.css" />
    <link rel="stylesheet" type="text/css" href="../Styles/Pages/resetPassword.min.css" />
</head>
<body>

    <div id="pageResetPasswordCont">

        <div id="pageResetPassword"

    <?php
        if (Session::exists("resetPasswordMessage")) {
            echo "class='extra'";
        }
    ?>

        >

            <h1>Reset Password</h1>

            <form method="post" action="">

                <ul class="blank">

                    <li>
                        <input type="text" placeholder="User ID" name="userID"/>
                    </li>

                    <li>
                        <a href="login.php">Back</a>
                        <button type="submit" 
                                name="resetPassword"
                                style="width: 200px;">
                            Send Reset Email
                        </button>
                    </li>

                    <li class="resetPasswordError">
                        <?= Session::get("resetPasswordMessage"); ?>
                    </li>

                </ul>
            </form>
        </div>
    </div>
</body>
</html>

<?php 

Session::delete("resetPasswordMessage");

/**
 * Function generates a random number based on your input number of digits
 *
 * @param int $numberOfDigits
 * @return string/int $resetCode
 */
function generateResetCode($numberOfDigits) { // Generate reset code based on how many digits you want it to be

    $resetCode = '';
    $count = 0;

    while ($count < $numberOfDigits) {

        $nextDigit = mt_rand(0, 9);

        $resetCode .= $nextDigit;
        $count++;
    }

    return $resetCode;
}
?>