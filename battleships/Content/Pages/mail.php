<?php
require_once("../Classes/setup.php");

if(!$argv[0])
{
	if(!Session::get("userID"))
	{
		// redirect to login page if user is not logged in already
		header("Location: login.php");
		exit();
	}
	else
	{
    	header("Location: home.php");
    	exit();
	}
}

if(sizeof($argv) == 5)
{
	$userID = $argv[1];
	$firstName = $argv[2];
	$lastName = $argv[3];
	$emailAddress = $argv[4];

	confirmationEmail($userID, $firstName, $lastName, $emailAddress);
}
else
{
	$userID = $argv[1];
	$firstName = $argv[2];
	$lastName = $argv[3];
	$emailAddress = $argv[4];
	$resetCode = $argv[5];

	passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode);
}


function confirmationEmail($userID, $firstName, $lastName, $emailAddress)
{
	require("../../Scripts/PHPMailer/class.PHPMailer.php");

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