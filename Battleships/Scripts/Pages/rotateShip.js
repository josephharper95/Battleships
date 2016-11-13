/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    10/11/16    intial creation
 * V0.11    Nikc    13/11/16    changed ID strings to variables
 * 
 */

function initShipRotation(ship) {
    // attach a keydown handler to the window
    $(window).off("keydown").keydown(function (e) {

        // when an "r" is pressed...
        if (e.which == 82) {
            // change the orientation of the ship
            ship.changeOrientation();

            if (hoverCell) {
                // re-run the hover function to show that the ship has changed orientation
                boardPlaceHover(ship);
            }
        }
    });

    $(rotateShipButton).fadeIn(200).off("click").on("click", function () {
        // change the orientation of the ship
        ship.changeOrientation();
    });
}

function endShipRotation() {
    $(window).unbind("keydown");

    $(rotateShipButton).off("click").fadeOut(200);
}