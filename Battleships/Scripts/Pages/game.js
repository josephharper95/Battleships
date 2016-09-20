// Global Variables
var boardSize;
var shipsToPlace = [
    {
        name: "Ship 1",
        size: 2
    },
    {
        name: "Ship 2",
        size: 3
    },
    {
        name: "Ship 3",
        size: 3
    },
    {
        name: "Ship 4",
        size: 4
    },
    {
        name: "Ship 5",
        size: 5
    }
];

$(document).ready(function () {

    initPlaceShips(0);

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

});

function initPlaceShips(index) {

    var cell;
    var orientation = "H";
    var ship = shipsToPlace[index];

    if (ship == undefined) {
        // cleanups
        $("#boardPlayer td").off("mouseenter");
        $(window).off("keydown");
        $("#boardPlayer td.hover").removeClass("hover");
        return;
    }

    $("#gameMessage").html("Place your " + ship.name);

    $("#boardPlayer td").on("mouseenter ", function () {
        cell = $(this);
        boardPlaceHover(cell, ship.size, orientation);    

        $(this).off("click").one("click", function () {
            boardPlaceShip(cell, ship, orientation);

            // cleanups
            $("#boardPlayer td").off("hover");
            $(window).off("keydown");

            initPlaceShips(index + 1);
        });    
    });

    $(window).keydown(function (e) {
        if (e.which == 82) {
            orientation = orientation == "H" ? "V" : "H";
            boardPlaceHover(cell, ship.size, orientation);
        }
    });

    $("#boardPlayer").mouseleave(function () {
        $("#boardPlayer td.hover").removeClass("hover");
    });

}

function boardPlaceHover($e, size, orientation) {
    $("#boardPlayer td.hover").removeClass("hover");

    var col = $e.index();
    var $tr = $e.closest('tr');
    var row = $tr.index();

    if (orientation == "H") {
        if (col + size <= boardSize) {
            for (i = 0; i < size; i++) {
                $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').addClass("hover");
                col++;
            }
        }
    }

    if (orientation == "V") {
        if (row + size <= boardSize) {
            for (i = 0; i < size; i++) {
                $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').addClass("hover");
                row++;
            }
        }
    }
}

function boardPlaceShip($cell, shipToPlace, orientation) {
    
    var col = $cell.index();
    var $tr = $cell.closest('tr');
    var row = $tr.index();

    if (orientation == "H") {
        if (col + shipToPlace.size <= boardSize) {
            for (i = 0; i < shipToPlace.size; i++) {
                $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').html(shipToPlace.name);
                col++;
            }
        }
    }

    if (orientation == "V") {
        if (row + shipToPlace.size <= boardSize) {
            for (i = 0; i < shipToPlace.size; i++) {
                $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').html(shipToPlace.name);
                row++;
            }
        }
    }
}