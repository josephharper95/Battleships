<!--
*
* Last Modified By: Nick Holdsworth
* Current Version: 0.1
*
* V0.1      Nick    01/10/16    initial creation
*
-->

<?php
    require_once("../Classes/setup.php");

    if(!Session::get("userID"))
    {
       Navigator::changePage("login.php");
       exit();
    }

require_once("header.php");

$size = 10;
$class = "small";

?>

<script type="text/javascript" src="../../Scripts/Pages/game.js"></script>
<script type="text/javascript" src="../../Scripts/Classes/game.js"></script>
<script type="text/javascript" src="../../Scripts/Classes/board.js"></script>
<script type="text/javascript" src="../../Scripts/Classes/coordinate.js"></script>
<script type="text/javascript" src="../../Scripts/Classes/ship.js"></script>
<script type="text/javascript" src="../../Scripts/Classes/AI.js"></script>

<body>

    <div id="pageGame" class="wideWidth">

        <div id="playerContainer" class="sideContainer">

            <div class="remainingShipsContainer">

                <h4>Ships Remaining</h4>

                <ul class="blank"></ul>
            </div>

            <div class="boardContainer">

                <h3>Player</h3>

                <table id="boardPlayer" class="board" data-size="<?= $class ?>" >
                    <?php echo createBoard(); ?>
                </table>

                <div style="width: 100%;text-align: center;margin-top:7px;">
                    <button class="button" 
                    style="display:none;"
                    id="startGame" >Start!</button>

                    <h3 id="gameMessage"></h3>
                </div>

            </div>

        </div>

        <div id="opponentContainer" class="sideContainer">

            <div class="remainingShipsContainer">

                <h4>Ships Remaining</h4>

                <ul class="blank"></ul>
            </div>

            <div class="boardContainer">

                <h3>Computer</h3>

                <table id="boardComputer" class="board" >
                    <?php echo createBoard(); ?>
                </table>
            </div>
        </div>
    </div>
</body>

</html>

<?php

require_once("footer.php");

?>

<?php

function createBoard() {
    global $size, $class;

    $str = "<tbody>";

    for ($i = 0; $i < $size; $i++) {
        $str .= "<tr>";

        for ($x = 0; $x < $size; $x++) {
            $str .= "<td class='$class'></td>";
        }

        $str .= "</tr>";
    }

    $str.= "</tbody>";

    return $str;
}

?>