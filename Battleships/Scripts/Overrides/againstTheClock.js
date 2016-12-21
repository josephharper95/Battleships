/**
 * 
 *  V0.1    Nick    21/12/16    initial creation
 * 
 */

var interval;

function startGameExtra() {

    var mm = 2;
    var ss = 30;

    $(opponentContainer + " .gameMessage").html("Time Left: " + mm + ":" + ss);

    interval = setInterval(function () {

        ss--;

        mm = ss < 0 ? mm - 1 : mm;
        ss = ss < 0 ? 59 : ss;

        var ssText = ss < 10 ? "0" + ss : ss;

        $(opponentContainer + " .gameMessage").html("Time Left: " + mm + ":" + ssText);

        if (mm == 0 && ss == 0) {

            $(opponentContainer + " .gameMessage").html("Times Up!");
            endGame("", true);    
        }

    }, 1000);
}

function endGameExtra() {

    clearInterval(interval);
}