/**
 * 
 *  V0.1    Nick    10/12/16    initial creation
 * 
 */

/**
 * Function that runs when DOM is ready
 */
$(document).ready(function() {

    // load the typewriter
    $("#typewriter").get(0).load();

    // attach a keydown event to the inputs
    $("#pageRegistration form input").on("keydown", function() {
        
        // play the typewriter
        $("#typewriter").get(0).play();
    });
});