<?php

/*
*
*   V0.1    Nick    13/10/16    initial creation
*   V0.2    Nick    17/01/17    medals now implemented
*
*/

require_once("../Classes/setup.php");

if (!Session::get("userID")) {

    // redirect to login page if user is not logged in already
    header("Location: login.php");
    exit();
}

require_once("header.php");

$user = new User();
$userId = Session::get("userID");

$m = $user->getAllMedalsByUserID($userId);

$medals = json_decode(json_encode($m), true);

?>

<link rel="stylesheet" type="text/css" href="../Styles/Pages/medals.min.css" />

<div id="pageMedalsCont"
        class="pageContainer">

    <div id="pageMedals">

        <ul class="blank">

<?php

foreach ($medals as $medal) {

?>

            <li>
                <div class="medal <?= $medal['medalCategory']; ?> <?= $medal['isUnlocked'] ? '' : 'locked'; ?>"></div>

                <div class="plaque">
                    <p>
                        <?= $medal['medalName']; ?>
                    </p>
                </div>
            </li>

<?php

}

?>

        </ul>
    </div>
</div>