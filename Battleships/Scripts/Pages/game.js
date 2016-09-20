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
    var orientation = "H";

    $("#boardPlayer td").hover(function () {

        $("#boardPlayer td.hover").removeClass("hover");

        var col = $(this).index();
        var $tr = $(this).closest('tr');
        var row = $tr.index();
        if (orientation == "H") {
            if (col + shipSize <= boardSize) {
                for (i = 0; i < shipSize; i++) {
                    $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').addClass("hover");
                    col++;
                }
            }
        }

        if (orientation == "V") {
            if (row + shipSize <= boardSize) {
                for (i = 0; i < shipSize; i++) {
                    $('#boardPlayer tr:eq(' + row + ') > td:eq(' + col + ')').addClass("hover");
                    row++;
                }
            }
        }
    });

    $(window).keydown(function (e) {
        if (e.which == 82) {
            orientation = orientation == "H" ? "V" : "H";
            console.log(orientation);
        }
    });

    $("#boardPlayer").mouseleave(function () {
        $("#boardPlayer td.hover").removeClass("hover");
    });

}