<?php
	require("..\Classes\setup.php");
    if(Input::itemExists("return")) // If user selected "Return to Login Screen"
    {
        header("Location: login.php");
        exit();
    }

	if(Input::itemExists("register"))
    {
        if(Input::post(""))
    }
    
    require("header.php");
?>
<form method='post' action=''>
	<fieldset>
	<legend>User Registration</legend>
	<div>
		Username: <input type='text' name='username'/><br/>
		Password: <input type='password' name='password'/><br/>
		Confirm Password: <input type='password' name='passwordmatch'/><br/>
		<input type='submit' name='register' value='Register'/><br/>
	</div>
	</fieldset>
</form> 
		
<form method='post' action=''>
	<div>
		<input type='submit' name='return' value='Return to Login Screen'/><br/>
	</div>
</form>

<?php
    require("footer.php");
?>