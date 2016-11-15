/**
 * Last Modified By: Nick Holdsworth
 * 
 * V0.1     Nick    09/11/16    initial creation
 * V0.2     Nick    10/11/16    added missing loader scripting
 * V0.3     Nick    15/11/16    added ability to set opacity of loader
 * 
 */

function showLoader(show) {
    if (show) {
        $("#loaderOverlay").fadeIn(200);
    } else {
        $("#loaderOverlay").fadeOut(200);
    }
}

function showWaiting(show, message, opacity) {
    if (show) {

        if (opacity) {
            $("#waitingOverlay").css("opacity", opacity);
        } else {
            $("#waitingOverlay").css("opacity", 0.8);
        }

        $("#waitingCont").fadeIn(200);
        $("#waitingOverlay").fadeIn(200, function () {
            $("#waitingMessage").html(message);
        });
    } else {
        $("#waitingCont").fadeOut(200);
        $("#waitingOverlay").fadeOut(200, function () {
            $("#waitingMessage").html("");
        });
    }
}