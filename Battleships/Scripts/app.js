/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    initial creation
 * V0.2     Nick    10/11/16    added missing loader scripting
 * 
 */

function showLoader(show) {
    if (show) {
        $("#loaderOverlay").fadeIn(200);
    } else {
        $("#loaderOverlay").fadeOut(200);
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