/**
 * Last Modified By: Nick Holdsworth
 * Current Version: 0.61
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
 * V0.11    Nick    02/12/16    added perk actions to file
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

// hard coded ships for the hack
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

    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'></li>";
    }

    $(boardExtras + " ul.remainingShips").html(remainingShipsHtml);
}

/******************************
 * 
 *           PERKS
 * 
 ******************************/

/**
 * 
 */
function updatePerks() {
    var perks = game.getPlayerPerksAvailable();

    var perkHtml = "";

    $.each(perks, function (i, val) {

        var split = i.split("_");
        split = split.join(" ");

        perkHtml += "<li>";

        perkHtml += "<button ";
        perkHtml += "class='button perk' ";
        perkHtml += "data-perk='" + i + "' ";

        if (val.usesLeft == 0) {
            perkHtml += "disabled ";
        }

        perkHtml += ">";

        perkHtml += split;
        perkHtml += " " + val.usesLeft;

        perkHtml += "</button>";

        perkHtml += "</li>";
    });

    $("#playerContainer .perks").html(perkHtml);

    $("#playerContainer .perk:not(:disabled)").off("click").one("click", function () {
        var cell = $(this);
        var perk = $(cell).data("perk");

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

    disablePerks();

    switch (perk) {
        case "Sonar":
            initSonarPerk();
            break;
        case "Bounce_Bomb":
            initBounceBombPerk();
            break;
    }
}

function endPlayerPerk(skipTurn, perk) {

    var x = game.updatePlayerPerks(perk);

    console.log("Perk removed: " + perk + " " + x); 

    updatePerks();

    if (!skipTurn) {
        playerMove();
    } else {
        AIMove();
    }
}

function bounceBombAction(x, y, bbOrientation) {
    var bounceBomb = new BouncingBomb(opponentBoardClass);

    var num = bounceBomb.action(x, y, bbOrientation);

        //opponentBoardClass.fire(x, y);
        boardFireAtOpponentCoordinate(x, y);

    if (num == 2) {

        if (bbOrientation == 1) {
            //opponentBoardClass.fire(x, y - 1);
            boardFireAtOpponentCoordinate(x, y - 1);
        } else {
            //opponentBoardClass.fire(x + 1, y);
            boardFireAtOpponentCoordinate(x + 1, y);
        }
    }

    removeHovers();
    endPlayerPerk(true, "Bounce_Bomb");
}

function sonarAction(x, y) {

    var sonar = new Sonar(opponentBoardClass);

    var cell = sonar.action(x, y);

    if (cell) {

        $(page + " " + opponentBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");

    } else {
        alert("no moves found :(");
    }

    // allow player to now make a move
    endPlayerPerk(false, "Sonar");
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

// function to invoke when the game is ready to start playing
function shipsPlaced() {
    // cleanups
    removeHovers();
    $(window).unbind("keydown");

    // show the start game button
    $(startGameButton).fadeIn(500);
    
    // add click handler to the button at this point
    $(startGameButton).unbind("click").one("click", function () {

        // on click - fade button out
        $(startGameButton).fadeOut(500);

        // invoke method startGame
        startGame();
    });
}

// function to start the game officially
function startGame() {

    window.onbeforeunload = confirmExit;

    $.ajax({
        url: "../../Content/Pages/gameAjax.php",
        data: {
            action: "incrementIncompleteGames"
        },
        type: "post"
    });

    // set the variable so other methods know the game has begun
    gameStarted = true;

    $(resetBoardButton).fadeOut(500).unbind("click");
    $(undoLastShipButton).fadeOut(500).unbind("click");

    $(boardExtras).fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    // let the player have the first move
    updatePerks();
    playerMove();
}

function confirmExit() {
    return "If you leave the page, your game will not be saved";
}

// function to end game - HACK
function endGame(winner, finished) {

    if (finished) {

        removeClicks();
        removeHovers();
        disablePerks();

        var endTime = new Date();
        var playingTime = (endTime.getTime() - startTime.getTime()) / 1000;
       
        /*** SCORING ***/
        var baseScore = 100;
        var negativeScorePerHitReceived = 5;
        var negativeScorePerShotMissed = 1;
        var positiveScorePerShotHit = 5;
        var winBonus = 0;
        var timeBonusPerSecond = 2;

        var shotsMissed = totalShots - totalHits;
        var timeBonus = 0;

        if (playingTime < 120) {
            var timeBonus = (120 - playingTime) * timeBonusPerSecond;
        }

        if (winner == "player") {
            winBonus = 100;
        }

        var totalHitRScore = (totalHitsReceived * negativeScorePerHitReceived);
        var shotsMissedScore = (shotsMissed * negativeScorePerShotMissed);
        var totalHitScore = (totalHits * positiveScorePerShotHit);

        var gameScore = baseScore 
                        - totalHitRScore
                        - shotsMissedScore
                        + totalHitScore 
                        + timeBonus 
                        + winBonus;
        /*** END SCORING ***/

        showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus);

        // alert appropriate message
        if (winner == "player") {
            $.ajax({
                url: "../../Content/Pages/gameAjax.php",
                data: {
                    action: "recordWin"
                },
                type: "post"
            });
        } else {
            showOpponentShips();
        }
    }

    $.ajax({
            url: "../../Content/Pages/gameAjax.php",
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
    var remainingShips = opponentBoardClass.getFloatingShips();

    for (var i = 0; i < remainingShips.length; i++) {
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

function showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus) {

    var won = false;

    if (winBonus != 0) {
        won = true;
    }

    $(scoreModal + " span").hide();

    $(scoreModalTitle).html(won ? "You Won!" : "You Lost!");

    $(scoreModalOverlay).fadeIn(200, function () {
        $(scoreModal).fadeIn(500);

        $("#baseScore span").fadeIn(500);
    });

    setTimeout(function () {
        $(scoreModal + " #hitsReceived span").html("- " + totalHitRScore + "pts").fadeIn(500);
    }, 500);

    setTimeout(function () {
        $(scoreModal + " #shotsMissed span").html("- " + shotsMissedScore + "pts").fadeIn(500);
    }, 1000);

    setTimeout(function () {
        $(scoreModal + " #shotsHit span").html("+ " + totalHitScore + "pts").fadeIn(500);
    }, 1500);

    setTimeout(function () {
        $(scoreModal + " #timeBonus span").html("+ " + timeBonus.toFixed(2) + "pts").fadeIn(500);
    }, 2000);

    setTimeout(function () {
        $(scoreModal + " #winBonus span").html("+ " + winBonus + "pts").fadeIn(500);
    }, 2500);

    setTimeout(function () {
        $(scoreModal + " #total span").html("+ " + gameScore.toFixed(2) + "pts").fadeIn(500);
    }, 3000);

    $("#closeModal").off("click").one("click", function () {
        $(scoreModalOverlay).fadeOut(200);
        $(scoreModal).fadeOut(500);
    });
}