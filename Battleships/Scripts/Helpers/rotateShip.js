/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    10/11/16    intial creation
 * V0.11    Nick    13/11/16    changed ID strings to variables
 * V0.12    Nick    19/01/17    final comments added
 * 
 */

/**
 * Function allow the rotation of a given ship
 * 
 * @param   {Ship}  ship    the ship to be rotated
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

    // add a click handler to the rotate button
    $(rotateShipButton).fadeIn(200).off("click").on("click", function () {

        // change the orientation of the ship
        ship.changeOrientation();
    });
}

/**
 * Function to remove the ability to rotate a ship
 */
function endShipRotation() {

    $(window).unbind("keydown");
    $(rotateShipButton).off("click").fadeOut(200);
}