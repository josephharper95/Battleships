// Global Variables
var game;
var playerBoard;
var computerBoard;
var AI;

var shipDetails = [
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
        name: "BattleShip",
        size: 4
    },
    {
        name: "Carrier",
        size: 5
    }
];

var shipsToPlace = new Array();

$(document).ready(function () {

    populateShips();
    initPlaceShips();

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

function populateShips() {

    var remainingShipsHtml = "";

    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'>" + shipDetails[i].name + "</li>";
    }

    $(".remainingShipsContainer ul").html(remainingShipsHtml);
}

function initPlaceShips() {

    var cell;
    var ship;

    for (i = 0; i < shipsToPlace.length; i++) {
        
        if (!shipsToPlace[i].isPlaced()) {
            ship = shipsToPlace[i];
            break;
        }
    }

    if (ship == undefined) {
        // cleanups
        $("#boardPlayer td").off("mouseenter");
        $(window).off("keydown");
        cleanupHoverClasses();
        $("#gameMessage").html("");

        gameReady();
        return;
    }

    $("#gameMessage").html("Place your " + ship.getName());

    $("#boardPlayer td").on("mouseenter ", function () {
        cell = $(this);
        boardPlaceHover(cell, ship);  
    });
    
    $(window).keydown(function (e) {
        if (e.which == 82) {
            ship.changeOrientation();
            boardPlaceHover(cell, ship);
        }
    });

    $("#boardPlayer").on ("mouseleave", function () {
        cleanupHoverClasses();
    });

}

function cleanupHoverClasses() {
    $("#boardPlayer td.hover").removeClass("hover");
    $("#boardPlayer td.noHover").removeClass("noHover");
    $("#boardComputer td.hover").removeClass("hover");
    $("#boardComputer td.hover").removeClass("noHover");
}

function boardPlaceHover($e, ship) {
    if (ship.isPlaced()) {
        return;
    }

    if ($e) {
        cleanupHoverClasses();
        
        var x = $e.index();
        var $tr = $e.closest('tr');
        var y = $tr.index();


        var canHover, coords;
        [canHover, coords] = playerBoard.canPlaceShip(ship, x, y);

        for (i = 0; i < coords.length; i++) {
            var c = coords[i];
            var hover = canHover ? "hover" : "noHover";

            if (c) {
                $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').addClass(hover);
            }
        }

        if (canHover) {
            $("#boardPlayer td").off("click");
            $("#boardPlayer td.hover").one("click", function () {
                boardPlaceShip($e, ship);
            }); 
        }
    }
}

function boardPlaceShip($cell, ship) {

    if (ship.isPlaced()) {
        return;
    }
    
    var x = $cell.index();
    var $tr = $cell.closest('tr');
    var y = $tr.index();

    var canHover, coords;
    [canHover, coords] = playerBoard.canPlaceShip(ship, x, y);

    if (canHover) {

        for (i = 0; i < coords.length; i++) {
            var c = coords[i];
            $('#boardPlayer tr:eq(' + c.getY() + ') > td:eq(' + c.getX() + ')').html(ship.name).attr("data-ship", ship.name).addClass("containsShip");
        }

        playerBoard.placeShip(ship, x, y);

        // cleanups
        $("#boardPlayer td").off("hover");
        cleanupHoverClasses();
        $(window).off("keydown");

        initPlaceShips();

        $cell.trigger("mouseenter");
    }
}

function boardFireHover($cell) {

    if ($cell) {
        cleanupHoverClasses();
        
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

        var coord = computerBoard.getObjectAt(x, y);
        var ship = coord.getShip();

        if (ship) {
            
            if (ship.isDestroyed()) {
                
                $("#opponentContainer .remainingShipsContainer li." + ship.getName()).addClass("destroyed");
            }
        }
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

            $("#boardComputer td.hover").off("click").one("click", function () {
                boardFireAtComputer(cell);

                // cleanups
                $("#boardPlayer td").off("hover");
                cleanupHoverClasses();

                AIMove();
            });
        });

        $("#boardComputer").on ("mouseleave", function () {
            cleanupHoverClasses();
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

        var coord = playerBoard.getObjectAt(coords.getX(), coords.getY());
        var ship = coord.getShip();

        if (ship) {
            
            if (ship.isDestroyed()) {

                $("#playerContainer .remainingShipsContainer li." + ship.getName()).addClass("destroyed");
            }
        }

        playerMove();
    } else {
        endGame();
    }
}

function endGame() {
    alert("Games over YOU MAG");
}