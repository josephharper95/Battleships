// Global Variables
var boardSize;

$(document).ready(function () {

    initPlaceShips();

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

function initPlaceShips() {

    $("#gameMessage").html("Place your small ship (2x1)");

    var shipSize = 2;
    var cell;
    var orientation = "H";

    $("#boardPlayer td").hover(function () {
        cell = $(this);
        boardPlaceHover(cell, shipSize, orientation);        
    });

    $(window).keydown(function (e) {
        if (e.which == 82) {
            orientation = orientation == "H" ? "V" : "H";
            boardPlaceHover(cell, shipSize, orientation);
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