// Global Variables
var game;
var playerBoard;
var computerBoard;

var shipsToPlace = [
    {
        name: "Destroyer",
        size: 2
    },
    {
        name: "Submarine",
        size: 3
    },
    {
        name: "Cruiser",
        size: 3
    },
    {
        name: "Battleship",
        size: 4
    },
    {
        name: "Carrier",
        size: 5
    }
];

$(document).ready(function () {

    initPlaceShips(0);

    var boardSize;

    switch ($("#boardPlayer").data("size")) {
        case "small":
            boardSize = 10
            break;
        case "medium":
            boardSize = 15;
            break;
        case "large":
            boardSize = 20;
            break;
    }

    game = new Game(boardSize);
    playerBoard = game.getPlayerBoard();
    computerBoard = game.getComputerBoard();
});

function initPlaceShips(index) {

    var cell;
    var shipToPlace = shipsToPlace[index];

    if (shipToPlace == undefined) {
        // cleanups
        $("#boardPlayer td").off("mouseenter");
        $(window).off("keydown");
        $("#boardPlayer td.hover").removeClass("hover");
        $("#gameMessage").html("");

        gameReady();
        return;
    }

    var ship = new Ship(shipToPlace.name, shipToPlace.size);

    $("#gameMessage").html("Place your " + ship.getName());

    $("#boardPlayer td").on("mouseenter ", function () {
        cell = $(this);
        boardPlaceHover(cell, ship);    

        $(this).off("click").one("click", function () {
            boardPlaceShip(cell, ship);

            // cleanups
            $("#boardPlayer td").off("hover");
            $("#boardPlayer td.hover").removeClass("hover");
            $(window).off("keydown");

            initPlaceShips(index + 1);
        });    
    });
    
    $(window).keydown(function (e) {
        if (e.which == 82) {
            ship.changeOrientation();
            boardPlaceHover(cell, ship);
        }
    });

    $("#boardPlayer").mouseleave(function () {
        $("#boardPlayer td.hover").removeClass("hover");
    });

}

function boardPlaceHover($e, ship) {
    if ($e) {
        $("#boardPlayer td.hover").removeClass("hover");
        
        var x = $e.index();
        var $tr = $e.closest('tr');
        var y = $tr.index();

        var coords = playerBoard.canPlaceShip(ship, x, y);

        if (coords) {
            
            for (i = 0; i < coords.length; i++) {
                var c = coords[i];
                $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').addClass("hover");
            }
        } else {
            $("#boardPlayer td.hover").removeClass("hover");
        }
    }
}

function boardPlaceShip($cell, ship) {
    
    var x = $cell.index();
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    var coords = playerBoard.canPlaceShip(ship, x, y);

    for (i = 0; i < coords.length; i++) {
        var c = coords[i];
        $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').html(ship.name).attr("data-ship", ship.name).css("background-color", "red");
    }

    playerBoard.placeShip(ship, x, y);
}

function gameReady() {
    $("#startGame").fadeIn(500);
}