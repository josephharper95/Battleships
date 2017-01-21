/**
 * 
 *  V0.1    Nick    21/12/16    initial creation
 *  V0.11   Nick    19/01/17    final comments added
 * 
 */

// variable to house the timer
var interval;

/**
 * Function to override the existing function to run the against the clock functionality
 */
function startGameExtra() {

    // initialise how many minutes and seconds we want
    var mm = 2;
    var ss = 30;

    // set the text to be the remaining time
    $(opponentContainer + " .gameMessage").html("Time Left: " + mm + ":" + ss);

    // initialise the interval
    interval = setInterval(function () {

        // take a second off
        ss--;

        // if the seconds go below zero adjust the minutes and seconds
        mm = ss < 0 ? mm - 1 : mm;
        ss = ss < 0 ? 59 : ss;

        // if the seconds go below 10, prepend a zero
        var ssText = ss < 10 ? "0" + ss : ss;

        // set the reminaing time text
        $(opponentContainer + " .gameMessage").html("Time Left: " + mm + ":" + ssText);

        // if time is up
        if (mm == 0 && ss == 0) {

            // end the game
            $(opponentContainer + " .gameMessage").html("Times Up!");
            endGame("", true);    
        }

    // run the interval every second
    }, 1000);
}

/**
 * Function to override the existing function to clear the interval
 */
function endGameExtra() {

    clearInterval(interval);
}