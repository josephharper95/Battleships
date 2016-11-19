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
 * 
 */

// Global Variables
var page = "#pageComputerGame";
var playerBoard = "#playerBoard";
var opponentBoard = "#computerBoard";

var startGameButton = "#startGame";
var rotateShipButton = "#rotateShip";
var undoLastShipButton = "#undoLastShip";
var resetBoardButton = "#resetBoard";

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

    $(".boardExtrasContainer ul.remainingShips").html(remainingShipsHtml);
}

/******************************
 * 
 *           PERKS
 * 
 ******************************/

/**
 * Make buttons look disabled
 */
function disablePerks() {
    $(".perkContainer .perk.button").addClass("disabled");
}

/**
 * Make buttons look enabled
 */
function enablePerks() {
    $(".perkContainer .perk.button").removeClass("disabled");
}

/**
 * Initial function that gets the perk and decides how to respond
 */
function runPlayerPerk(perk) {

    switch (perk) {
        case "sonar":
            initSonarPerk();
    }
}

function endPlayerPerk() {
    enablePerks();
    playerMove();
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

    $(".boardExtrasContainer").fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    // let the player have the first move
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
        var winBonus = 100;
        var timeBonusPerSecond = 2;

        var shotsMissed = totalShots - totalHits;
        var timeBonus = 0;
        if(playingTime < 120)
        {
            var timeBonus = (120 - playingTime)*timeBonusPerSecond;
        }
        if (winner != "player")
        {
            winBonus = winBonus - winBonus;
        }

        var gameScore = baseScore - (totalHitsReceived*negativeScorePerHitReceived) - (shotsMissed*negativeScorePerShotMissed)
                        + (totalHits*positiveScorePerShotHit) + timeBonus + winBonus;
        /*** END SCORING ***/

        // alert appropriate message
        if (winner == "player") {
            $.ajax({
                url: "../../Content/Pages/gameAjax.php",
                data: {
                    action: "recordWin"
                },
                type: "post"
            });

            alert("Game Over! - You Won! :)");
        } else {
            alert("Game Over! - You Lost! :(");
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