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

?>

<?php 
    Session::delete("changePasswordMessage");

    function passwordResetEmail($userID, $firstName, $lastName, $emailAddress, $resetCode)
	{
		require("../../Scripts/PHPMailer/class.PHPMailer.php");

		$account="battleshipsonlinetest@outlook.com";
		$password="captainsinkswithship2017";
		$to=$emailAddress;
		$from="battleshipsonlinetest@outlook.com";
		$from_name="BattleShips Online";
		$msg="Hello Captain ".$firstName." ".$lastName.", you recently requested a password reset...
			<br/> Your User ID is: ".$userID.
            "<br/><br/> Please click the following link to reset your password: 
            <br/> https://battleships.online/battleships/Content/Pages/confirmPasswordReset.php?resetCode=".$resetCode."&userID=".$userID; // HTML message
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

		if(!$mail->Send())
		{
		echo "Message could not be sent. <p>";
		echo "Mailer Error: " . $mail->ErrorInfo;
		exit;
		}

		echo "Message has been sent";
	}
?>