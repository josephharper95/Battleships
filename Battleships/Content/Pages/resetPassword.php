<?php

/**
*
*   V0.1    Joe    17/01/17    initial creation
*   V0.2    Joe    18/01/17    updated with queries and email
*   V0.21   Joe    18/01/17    updated email address
*   V0.22   Joe    18/01/17    added validation
*   V0.3    Nick    18/01/17    made it pretty
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

        if ($userQuery->db->getRowCount() > 0) {

            foreach ($rows as $row) {

                $emailAddress = $row->emailAddress;
                $firstName = $row->firstName;
                $lastName = $row->lastName;
            }

            $resetCode = generateResetCode(8);
            $userQuery->insertPendingPasswordReset($userID, $resetCode);

            passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode);
            Session::set("resetPasswordMessage", "Please check your emails and click the password reset link");

        } else {

            Session::set("resetPasswordMessage", "No user found with that user ID");
        }
    } else {

        Session::set("resetPasswordMessage", "Not a valid user");
    }
} else {

    Session::set("resetPasswordMessage", "Please ensure you have entered a user ID");
}

?>

<!DOCTYPE HTML>
<html>
<head>
    <title>BattleShips Online - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="../Styles/app.css" />
    <link rel="stylesheet" type="text/css" href="../Styles/Pages/resetPassword.css" />
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

function generateResetCode($numberOfDigits) {

    $resetCode = '';
    $count = 0;

    while ($count < $numberOfDigits) {

        $nextDigit = mt_rand(0, 9);

        $resetCode .= $nextDigit;
        $count++;
    }

    return $resetCode;
}

function passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode) {

    require("../../Scripts/PHPMailer/class.PHPMailer.php");

    $account="battleshipsonline@outlook.com";
    $password="zHU9BaxAeJVPJXhy";
    $to=$emailAddress;
    $from="battleshipsonline@outlook.com";
    $from_name="BattleShips Online";
    $msg="Hello Captain ".$firstName." ".$lastName.", you recently requested a password reset...
        <br/> Your User ID is: ".$userID.
        "<br/><br/> Please click the following link to reset your password: 
        <br/> <a href='https://battleships-preprod.tk/battleships/Content/Pages/confirmPasswordReset.php?resetCode=".$resetCode."&userID=".$userID."'>RESET PASSWORD</a>"; // HTML message
    $subject="BattlesShips Online Password Reset!";

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPDebug  = 1;
    $mail->CharSet = 'UTF-8';
    $mail->Host = "smtp.live.com";
    $mail->SMTPAuth= true;
    $mail->Port = 587;
    $mail->Username= $account;
    $mail->Password= $password;
    $mail->SMTPSecure = 'tls';
    $mail->From = $from;
    $mail->FromName= $from_name;
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $msg;
    $mail->addAddress($to);

    $mail->Send();

    /*if(!$mail->Send())
    {
    echo "Message could not be sent. <p>";
    echo "Mailer Error: " . $mail->ErrorInfo;
    exit;
    }

    echo "Message has been sent";*/
}

?>