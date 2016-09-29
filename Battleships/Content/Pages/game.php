<?php
    require("..\Classes\setup.php");

    if(!Session::get("userID"))
    {
       header("location: login.php");#
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

<body>

    <div id="pageGame" class="standardWidth">

        <div class="boardContainer">

            <h3>Player</h3>

            <table id="boardPlayer" class="board" data-size="<?= $class ?>" >
                <?php echo createBoard(); ?>
            </table>

            <div style="width: 100%;text-align: center;margin-top:7px;">
                <div class="button" 
                style="display:none"
                id="startGame" >Start!</div>

                <h3 id="gameMessage"></h3>
            </div>

        </div>

        <div class="boardContainer">

            <h3>Computer</h3>

            <table id="boardComputer" class="board" >
                <?php echo createBoard(); ?>
            </table>
            
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