$(document).ready(function() {

    $("#pageRegistration form input").on("keydown", function() {
        $("#typewriter").get(0).load();
        $("#typewriter").get(0).play();
    });

});