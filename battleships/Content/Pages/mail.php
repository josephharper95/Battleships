<?php
/**

* V0.1      Joe     19/01/17    initial creation, methods moved from resetPassword.php and registration.php
*
**/

require_once("../Classes/setup.php");

if(!$argv[0]) // If user visits page manually
{
	if(!Session::get("userID"))
	{
		// redirect to login page if user is not logged in already
		header("Location: login.php");
		exit();
	}
	else
	{  // redirect to home page is user is logged in
    	header("Location: home.php");
    	exit();
	}
}

if(sizeof($argv) == 5) // If confirmation email required
{
	$userID = $argv[1];
	$firstName = $argv[2];
	$lastName = $argv[3];
	$emailAddress = $argv[4];

	confirmationEmail($userID, $firstName, $lastName, $emailAddress); // send confirmation email
}
else
{ // if password reset email is required
	$userID = $argv[1];
	$firstName = $argv[2];
	$lastName = $argv[3];
	$emailAddress = $argv[4];
	$resetCode = $argv[5];

	passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode); // send password reset email
}


function confirmationEmail($userID, $firstName, $lastName, $emailAddress)
{
	require("../../Scripts/PHPMailer/class.PHPMailer.php");
	
	// Prepare details for email
	$account="battleshipsonline@outlook.com";
	$password="zHU9BaxAeJVPJXhy";
	$to=$emailAddress;
	$from="battleshipsonline@outlook.com";
	$from_name="BattleShips Online";
	$msg="Hello Captain ".$firstName." ".$lastName.", and welcome to BattleShips Online, the new and improved online version of the classic board game!
		<br/> Your User ID is: ".$userID; // HTML message
	$subject="Welcome to BattleShips Online!";

	$mail = new PHPMailer();
	$mail->IsSMTP();
	$mail->SMTPDebug  = 1; // low debug mode
	$mail->CharSet = 'UTF-8';
	$mail->Host = "smtp.live.com"; // chosen smtp server
	$mail->SMTPAuth= true;
	$mail->Port = 587;
	$mail->Username= $account;
	$mail->Password= $password;
	$mail->SMTPSecure = 'tls'; // required for authentication
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

	echo "Message has been sent";*/ // Left in place for debug purposes
}

function passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode) {

    require("../../Scripts/PHPMailer/class.PHPMailer.php");
	// Prepare details for email
    $account="battleshipsonline@outlook.com";
    $password="zHU9BaxAeJVPJXhy";
    $to=$emailAddress;
    $from="battleshipsonline@outlook.com";
    $from_name="BattleShips Online";
    $msg="Hello Captain ".$firstName." ".$lastName.", you recently requested a password reset...
        <br/> Your User ID is: ".$userID.
        "<br/><br/> Please click the following link to reset your password: 
        <br/> <a href='https://battleships.online/battleships/Content/Pages/confirmPasswordReset.php?resetCode=".$resetCode."&userID=".$userID."'>RESET PASSWORD</a>"; // HTML message
    $subject="BattlesShips Online Password Reset!";

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPDebug  = 1; // low debug mode
    $mail->CharSet = 'UTF-8';
    $mail->Host = "smtp.live.com"; //chosen smtp server
    $mail->SMTPAuth= true;
    $mail->Port = 587;
    $mail->Username= $account;
    $mail->Password= $password;
    $mail->SMTPSecure = 'tls'; // used for authentication
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

    echo "Message has been sent";*/ // Left in for future debug purposes
}

?>