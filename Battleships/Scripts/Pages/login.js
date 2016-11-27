$(document).ready(function() {

    $("#pageLogin form input").on("keydown", function(event) {

        var inp = String.fromCharCode(event.keyCode);

        if (/[a-zA-Z0-9-_ ]/.test(inp)) {

            $("#typewriter").get(0).load();
            $("#typewriter").get(0).play();
        }
    });

});