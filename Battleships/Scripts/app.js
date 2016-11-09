/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    initial creation
 * 
 */

function showLoader(show) {
    if (show) {

    } else {

    }
}

function showWaiting(show, message) {
    if (show) {
        $("#waitingOverlay").fadeIn(200, function () {
            $("#waitingMessage").html(message);
        });
    } else {
        $("#waitingOverlay").fadeOut(200, function () {
            $("#waitingMessage").html("");
        });
    }
}