<?php

require_once("header.php");

$size = 10;
$class = "small";

?>

<script type="text/javascript" src="../../Scripts/Pages/game.js"></script>

<body>

    <div id="pageGame" class="standardWidth">

        <div class="boardContainer">

            <h3>Player</h3>

            <table id="boardPlayer" class="board" data-size="<?= $class ?>" >
                <?php echo createBoard(); ?>
            </table>

        </div>

        <div class="boardContainer">

            <h3>Computer</h3>

            <table id="boardComputer" class="board" >
                <?php echo createBoard(); ?>
            </table>
            
        </div>

        <h3 id="gameMessage"></h3>

    </div>

</body>

</html>

<?php

require_one("footer.php");

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