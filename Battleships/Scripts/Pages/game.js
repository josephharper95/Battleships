// Global Variables
var game;
var playerBoard;
var computerBoard;
var AI;

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

        $("#boardPlayer td").off("click");
        $("#boardPlayer td").one("click", function () {
            boardPlaceShip(cell, ship, index);
        });   
    });
    
    $(window).keydown(function (e) {
        if (e.which == 82) {
            ship.changeOrientation();
            boardPlaceHover(cell, ship);
        }
    });

    $("#boardPlayer").on ("mouseleave", function () {
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

function boardPlaceShip($cell, ship, index) {
    
    var x = $cell.index();
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    var coords = playerBoard.canPlaceShip(ship, x, y);

    if (coords) {

        for (i = 0; i < coords.length; i++) {
            var c = coords[i];
            $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').html(ship.name).attr("data-ship", ship.name).addClass("containsShip");
        }

        playerBoard.placeShip(ship, x, y);

        // cleanups
        $("#boardPlayer td").off("hover");
        $("#boardPlayer td.hover").removeClass("hover");
        $(window).off("keydown");

        initPlaceShips(index + 1);
    } else {
        $("#boardPlayer td").off("click");
        $("#boardPlayer td").one("click", function () {
            boardPlaceShip(cell, ship, index);
        });  
    }
}

function boardFireHover($cell) {

    if ($cell) {
        $("#boardComputer td.hover").removeClass("hover");
        
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        var canFire = computerBoard.canFire(x, y);

        if (canFire) {
            $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("hover");
        }
    }
}

function boardFireAtComputer($cell) {
    var x = $cell.index();
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    var hit = computerBoard.fire(x, y);

    if (hit) {
        $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("containsShip");
    }
    
    $('#boardComputer tr:eq(' + y + ') > td:eq(' + x + ')').addClass("hit");
}

function gameReady() {
    // cleanups
    $("boardPlayer td").off("mouseenter");
    $("boardPlayer td").off("mouseleave");
    $(window).off("keydown");

    $("#startGame").fadeIn(500);
    
    $("#startGame").off("click").one("click", function () {
        $("#startGame").fadeOut(500);
        startGame();
    });
}

function startGame() {
    console.log("---- GAME STARTING ----");

    placeUIShips();

    playerMove();    
}

function placeUIShips() {
    AI = new AI("AI", computerBoard, playerBoard);
    AI.placeShips();
}

function playerMove() {
    if (game.isViable()) {
        $("#boardComputer td").on("mouseenter", function () {
            cell = $(this);
            boardFireHover(cell);

            $(this).off("click").one("click", function () {
                boardFireAtComputer(cell);

                // cleanups
                $("#boardPlayer td").off("hover");
                $("#boardPlayer td.hover").removeClass("hover");

                AIMove();
            });
        });

        $("#boardComputer").on ("mouseleave", function () {
            $("#boardPlayer td.hover").removeClass("hover");
        });
    } else {
        endGame();
    }
}

function AIMove() {
    if (game.isViable()) {

        $("#boardComputer td").off("mouseenter").off("mouseleave");
        $("#boardComputer td").off("click");

        var coords = AI.fire();

        $('#boardPlayer tr:eq(' + coords.getY() + ') > td:eq(' + coords.getX() + ')').addClass("hit");

        playerMove();
    } else {
        endGame();
    }
}

function endGame() {
    alert("Games over YOU MAG");
}