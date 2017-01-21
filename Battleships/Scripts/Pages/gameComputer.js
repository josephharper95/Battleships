/**
 *
 * V0.1     Nick    01/10/16    initial creation
 * V0.11    Nick    04/10/16    made code stricter and tightened validation and commented
 * V0.2     Nick    07/10/16    implemented undo place ship / reset board
 * V0.3     Nick    12/10/16    added ship images
 * VO.31    Dave    13/10/16    changed AI class to AIMedium
 * V0.32    Nick    13/10/16    made AI class dynamic based on user selection
 * V0.33    Nick    15/10/16    stopped user being able to click when game is finished, fixed bug where undo / reset was not actually resetting images
 * V0.34    Dave    17/10/16    Added AIHard creation.
 * V0.35    Nick    17/10/16    reformatted methods to be grouped, updated comments to be in line with other files
 * V0.36    Ncik    17/10/16    added helper method to reduce duplicated code, enemy ship images now show when you destroy a ship
 * V0.4     Nick    18/10/16    opponent ships show up if you lose
 * V0.41    Joe     26/10/16    renamed methods
 * V0.5     Nick    29/10/16    added initial sonar capabilities
 * V0.6     Nick    01/11/16    tracking statistics
 * V0.61    Nick    01/11/16    added total playing time
 * V0.7     Nick    03/11/16    split off code into more files
 * V0.8     Nick    10/11/16    added confirmation when user wants to leave page (WHEN ACTUALLY PLAYING)
 * V0.81    Nick    13/11/16    added variables for buttons, extracted set attributes on ship to own file
 * V0.82    Nick    13/11/16    statistics bug fix for incrementing games played
 * V0.83    Joe     14/11/16    added game scoring method and passed the game score to ajax call
 * V0.84    Nick    17/11/16    changed function it was calling to be correct
 * V0.9     Nick    28/11/16    added scoring modal
 * V0.91    Nick    28/11/16    fade bug
 * V1.0     Nick    01/12/16    overhaul to perks so that they are now dynamic by board size
 * V1.1     Nick    02/12/16    added perk actions to file
 * V1.11    Nick    02/12/16    removed console.log
 * V1.2     Nick    06/12/16    added mortar
 * V1.21    Nick    06/12/16    fixed bug for scoring
 * V1.3     Nick    07/12/16    changed alerts to new timeout message functionality
 * V1.31    Nick    10/12/16    updated updatePerks() so if it is zero or less insted of just zero
 * V1.32    Nick    11/12/16    changed page links to ajax files
 * V2.0     Dave    16/01/17    added ajax to check medal unlocks
 * V2.01    Nick    19/01/17    final comments added
 * 
 */

// Global Variables
var page = "#pageSinglePlayer";
var playerBoard = "#playerBoard";
var opponentBoard = "#computerBoard";

var startGameButton = "#startGame";
var rotateShipButton = "#rotateShip";
var undoLastShipButton = "#undoLastShip";
var resetBoardButton = "#resetBoard";

var boardExtras = ".boardExtras";

var scoreModalOverlay = "#scoreModalOverlay";
var scoreModal = "#scoreModal";
var scoreModalTitle = scoreModal + " #resultTitle";

var game;
var gameStarted = false;
var playerBoardClass;
var opponentBoardClass;
var AI;
var difficulty;
var boardSize;

var totalShots = 0;
var totalHits = 0;
var totalHitsReceived = 0;
var startTime = new Date();

// hard coded ships
var shipDetails = [
    {
        name: "Destroyer",
        size: 2
    },
    {
        name: "Submarine",
        size: 3
    },
    {
        name: "Cruiser",
        size: 3
    },
    {
        name: "BattleShip",
        size: 4
    },
    {
        name: "Carrier",
        size: 5
    }
];

// initialise the ships to place
var shipsToPlace = new Array();

/**
 * Function once DOM is ready, i.e. once PHP has come back processed
 */
$(document).ready(function () {

    // populate the ships array and the remaining ships containers
    populateShips();

    // allow user to place ships
    initPlaceShips();

    boardSize = $(page + " " + playerBoard + " tr").length;
    difficulty = $("#opponentContainer").data("difficulty");

    // initiliase game object and get the player / computer board
    game = new Game(boardSize);
    playerBoardClass = game.getPlayerBoard();
    opponentBoardClass = game.getComputerBoard(); 
});

/******************************
 * 
 *      POPULATING SHIPS
 * 
******************************/

/**
 * Function to populate the ships that can be placed into an array and into the reamining ships container in the HTML
 */
function populateShips() {

    var remainingShipsHtml = "";

    // recurse through hard coded ships
    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'></li>";
    }

    // publish the remaining ships HTML
    $(boardExtras + " ul.remainingShips").html(remainingShipsHtml);
}

/******************************
 * 
 *           PERKS
 * 
 ******************************/

/**
 * Function to update the perks that the user has access to
 */
function updatePerks() {

    // get the perks object from the game class
    var perks = game.getPlayerPerksAvailable();

    // initialise the HTML to be an empty string
    var perkHtml = "";

    // iterative through each of the perks
    $.each(perks, function (i, val) {

        // change any '_' to ' '
        var split = i.split("_");
        split = split.join(" ");

        // open the li tag
        perkHtml += "<li>";

        // add a button
        perkHtml += "<button ";
        perkHtml += "class='button perk' ";
        perkHtml += "data-perk='" + i + "' ";

        // if there aren't any uses left, add a disabled attribute
        if (val.usesLeft <= 0) {

            perkHtml += "disabled ";
            val.usesLeft = 0;
        }

        // close the button opening tag
        perkHtml += ">";

        // add the perk name with the # of uses
        perkHtml += split;
        perkHtml += " " + val.usesLeft;

        // close the button off
        perkHtml += "</button>";

        // close the li off
        perkHtml += "</li>";
    });

    // publish the HTML to the ul
    $("#playerContainer .perks").html(perkHtml);

    // for each of the enabled perks, add a click handler
    $("#playerContainer .perk:not(:disabled)").off("click").one("click", function () {
        
        // get the perk selected
        var cell = $(this);
        var perk = $(cell).data("perk");

        // run the perk
        runPlayerPerk(perk);
    });
}

/**
 * Make buttons look disabled
 */
function disablePerks() {

    $("#playerContainer .perk").attr("disabled", "disabled");
}

/**
 * Initial function that gets the perk and decides how to respond
 */
function runPlayerPerk(perk) {

    // make sure perks are disabled so another one cannot be run
    disablePerks();

    // find the appropriate method to run
    switch (perk) {

        case "Sonar":
            initSonarPerk();
            break;

        case "Bounce_Bomb":
            initBounceBombPerk();
            break;

        case "Mortar":
            initMortarPerk();
            break;
    }
}

/**
 * Function that runs at the end of each perk
 * 
 * @param   {boolean}   skipTurn    true for if perk counts as a move
 * @param   {string}    perk        the perk that has been used
 */
function endPlayerPerk(skipTurn, perk) {

    // update the player perks to decrement the one just used
    var x = game.updatePlayerPerks(perk);

    // update the HTML now that the class has been updated
    updatePerks();

    // allow the appropriate player to have their turn
    if (skipTurn) {
        AIMove();
    } else {
        playerMove();
    }
}

/**
 * Function to actually run the bounce bomb on the board
 * 
 * @param   {number}    x               the x value
 * @param   {number}    y               the y value
 * @param   {number}    bbOrientation   orientation that the bounce bomb should follow
 */
function bounceBombAction(x, y, bbOrientation) {

    // put the bounce bomb class to a variable
    var bounceBomb = new BouncingBomb(opponentBoardClass);

    // get the number of valid moves
    var num = bounceBomb.action(x, y, bbOrientation);

    // fire at the first coordinate
    boardFireAtOpponentCoordinate(x, y);

    // if the number of valid moves is 2, shoot at the next coordinate
    if (num == 2) {

        if (bbOrientation == 1) {
            
            boardFireAtOpponentCoordinate(x, y - 1);
        } else {
            
            boardFireAtOpponentCoordinate(x + 1, y);
        }
    }

    // remove any hover handlers
    removeHovers();

    // end the perk
    endPlayerPerk(true, "Bounce_Bomb");
}

/**
 * Function to actually run the sonar perk on the board
 * 
 * @param   {number}    x   the x value
 * @param   {number}    y   the y value
 */
function sonarAction(x, y) {

    // put the sonar class to a variable
    var sonar = new Sonar(opponentBoardClass);

    // run the sonar action to see if it finds a cell
    var cell = sonar.action(x, y);

    // if it finds a cell
    if (cell) {

        // show the cell on the board that it has found
        $(page + " " + opponentBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");

    } else {

        // show a message so the user knows it hasn't found anything
        showMessageTimeout("No moves found! Better luck next time...", 2000);
    }

    // end the perk
    endPlayerPerk(true, "Sonar");
}

/**
 * Function to actually run the mortar perk
 * 
 * @param   {number}    x   the x value
 * @param   {number}    y   the y value
 */
function mortarAction(x, y) {

    // put the morter class to a variable
    var mortar = new Mortar(opponentBoardClass);

    // get the cells it has found to a variable
    var cells = mortar.action(x, y);

    // check that there are cell and there are only 3
    if (cells && cells.length == 3) {
        
        // iterate through each cell
        for (var i = 0; i < cells.length; i++) {

            // fire at the appropriate coordinate
            boardFireAtOpponentCoordinate(cells[i].getX(), cells[i].getY());
        }
    }

    // remove any hover handlers
    removeHovers();

    // end the perk
    endPlayerPerk(true, "Mortar");
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

/**
 * Function to invoke when the game is ready to start playing
 */
function shipsPlaced() {

    // cleanups
    removeHovers();
    $(window).unbind("keydown");

    setTimeout(function () {
        // show the start game button
        $(startGameButton).fadeIn(500);
    }, 200);
    
    // add click handler to the button at this point
    $(startGameButton).unbind("click").one("click", function () {

        // on click - fade button out
        $(startGameButton).fadeOut(500);

        // invoke method startGame
        startGame();
    });
}

/**
 * Function to start the game officially
 */
function startGame() {

    // add a message in case the user wants to leave the page
    window.onbeforeunload = confirmExit;

    // increment the amount of incomplete games the user has, just in case they leave the game
    $.ajax({
        url: "../../Content/Ajax/gameAjax.php",
        data: {
            action: "incrementIncompleteGames"
        },
        type: "post"
    });

    // set the variable so other methods know the game has begun
    gameStarted = true;

    // make sure to hide and remove click handlers from the reset / undo buttons to avoid cheating
    $(resetBoardButton).fadeOut(500).unbind("click");
    $(undoLastShipButton).fadeOut(500).unbind("click");

    // show the board extras (ships remaining, perks)
    $(boardExtras).fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    // let the player have the first move
    updatePerks();
    playerMove();
}

/**
 * Message to display to user onbeforeunload
 */
function confirmExit() {
    return "If you leave the page, your game will not be saved";
}

/**
 * Function to end the game
 * 
 * @param   {string}    winner      the person who has won the game
 * @param   {boolean}   finished    whether the game has actually finished
 */
function endGame(winner, finished) {

    // confirm the game has finished
    if (finished) {

        // remove any clicks, hovers, and disable the perks. i.e. close the game
        removeClicks();
        removeHovers();
        disablePerks();

        // set the end time and calculate the playing time for statistics
        var endTime = new Date();
        var playingTime = (endTime.getTime() - startTime.getTime()) / 1000;
       
        // scoring multiplier
        var difficultyMultiplier = 0.75;

        switch (difficulty) {
                
            case "medium":
                difficultyMultiplier = 1;
                break;

            case "hard":
                difficultyMultiplier = 1.25;
                break;
        }

        // board bonus
        var boardSizeBonus = 0;

        switch (boardSize) {

            case 15:
                boardSizeBonus = 100;
                break;

            case 20:
                boardSizeBonus = 200;
                break;
        }

        // scoring multiplier defaults
        var baseScore = 100;
        var negativeScorePerHitReceived = 5;
        var negativeScorePerShotMissed = 1;
        var positiveScorePerShotHit = 5;
        var winBonus = winner == "player" ? 100 : 0;
        var timeBonusPerSecond = 2;

        // calculate statistics
        var shotsMissed = totalShots - totalHits;
        var accuracy = (totalHits/totalShots) *100;
        var timeBonus = 0;

        // playing time bonus
        if (playingTime < 120) {

            var timeBonus = (120 - playingTime) * timeBonusPerSecond;
        }

        // scoring statistics
        var totalHitRScore = (totalHitsReceived * negativeScorePerHitReceived);
        var shotsMissedScore = (shotsMissed * negativeScorePerShotMissed);
        var totalHitScore = (totalHits * positiveScorePerShotHit);

        // calculate total game score
        var gameScore = ((baseScore 
                        - totalHitRScore
                        - shotsMissedScore
                        + totalHitScore 
                        + timeBonus 
                        + winBonus)
                        * difficultyMultiplier)
                        + boardSizeBonus;

        // show the score modal
        showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus, difficultyMultiplier, boardSizeBonus);

        // record the win in the database if the player has won
        if (winner == "player") {

            // fire off the ajax
            $.ajax({
                url: "../../Content/Ajax/gameAjax.php",
                data: {
                    action: "recordWin"
                },
                type: "post"
            });
        } else {

            // if the player lost, show the opponent's ships
            showOpponentShips();
        }
    }

    // run the rest of the statistics
    $.ajax({
        url: "../../Content/Ajax/gameAjax.php",
        data: {
            action: "recordShots",
            totalHits: totalHits,
            totalHitsReceived: totalHitsReceived,
            totalShots: totalShots,
            playingTime: playingTime,
            gameScore: gameScore
        },
        type: "post"
    });

    // check if medal conditions are met
    $.ajax({
        url: "../../Content/Ajax/medalAjax.php",
        data: {
            action: "checkMedalConditions",
            difficulty: difficulty,
            winner: winner,
            boardSize: boardSize,
            accuracy: accuracy,
            numberOfHits: totalHitsReceived
        },
        type: "post"
    });

    // take the message off of the window unload
    window.onbeforeunload = null;
}

/******************************
 * 
 *      POST GAME EVENTS
 * 
******************************/

/**
 * Function to show opponent ships if you lose
 */
function showOpponentShips() {

    // get the ships that aren't already shown
    var remainingShips = opponentBoardClass.getFloatingShips();

    // iterate through she ships
    for (var i = 0; i < remainingShips.length; i++) {

        // run the function for the individual ship
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

/**
 * Function to show the score at the end
 * 
 * @param   {float}     gameScore               the total score
 * @param   {float}     totalHitRScore          total hits received score
 * @param   {float}     shotsMissedScore        total shots missed score
 * @param   {float}     totalHitScore           total shots hit score
 * @param   {float}     timeBonus               total time bonus
 * @param   {float}     winBonus                win bonus
 * @param   {float}     difficultyMultiplier    difficulty multiplier
 * @param   {float}     boardSizeBonus          bonus for the board size
 */
function showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus, difficultyMultiplier, boardSizeBonus) {

    // whether the user won
    var won = winBonus != 0 ? true : false;

    $(scoreModal + " span").hide();

    $(scoreModalTitle).html(won ? "You Won!" : "You Lost!");

    $(scoreModalOverlay).fadeIn(200, function () {
        $(scoreModal).fadeIn(500);

        $("#baseScore span").fadeIn(500);
    });

    setTimeout(function () {
        var sign = totalHitRScore < 0 ? "" : "- ";
        $(scoreModal + " #hitsReceived span").html(sign + totalHitRScore + "pts").fadeIn(500);
    }, 500);

    setTimeout(function () {
        var sign = shotsMissedScore < 0 ? "" : "- ";
        $(scoreModal + " #shotsMissed span").html(sign + shotsMissedScore + "pts").fadeIn(500);
    }, 1000);

    setTimeout(function () {
        var sign = totalHitScore < 0 ? "" : "+ ";
        $(scoreModal + " #shotsHit span").html(sign + totalHitScore + "pts").fadeIn(500);
    }, 1500);

    setTimeout(function () {
        var sign = timeBonus.toFixed(2) < 0 ? "" : "+ ";
        $(scoreModal + " #timeBonus span").html(sign + timeBonus.toFixed(2) + "pts").fadeIn(500);
    }, 2000);

    setTimeout(function () {
        var sign = winBonus < 0 ? "" : "+ ";
        $(scoreModal + " #winBonus span").html(sign + winBonus + "pts").fadeIn(500);
    }, 2500);

    setTimeout(function () {
        $(scoreModal + " #difficultyMultiplier span").html("x " + difficultyMultiplier).fadeIn(500);
    }, 3000);

    setTimeout(function () {
        var sign = boardSizeBonus < 0 ? "" : "+ ";
        $(scoreModal + " #boardSizeBonus span").html(sign + boardSizeBonus).fadeIn(500);
    }, 3500);

    setTimeout(function () {
        $(scoreModal + " #total span").html(gameScore.toFixed(2) + "pts").fadeIn(500);
    }, 4000);

    $("#closeModal").off("click").one("click", function () {
        $(scoreModalOverlay).fadeOut(200);
        $(scoreModal).fadeOut(500);
    });
}