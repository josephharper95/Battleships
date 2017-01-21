/**
 * 
 *  V0.1    Nick    01/12/16    initial creation
 * 
 */

/**
 * Once the DOM is ready
 */
$(document).ready(function() {

    $("#typewriter").get(0).load();

    // attach a keydown to event to the input boxes
    $("#pageLogin form input").on("keydown", function(event) {

        var inp = String.fromCharCode(event.keyCode);

        if (/[a-zA-Z0-9-_ ]/.test(inp)) {

            $("#typewriter").get(0).play();
        }
    });

});