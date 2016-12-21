/**
 * 
 *  V0.1    Nick    19/12/16    initial creation, last-stand mode
 *  V0.2    Nick    21/12/16    added hardcore mode
 *  V0.3    Nick    21/12/16    added fog of war mode
 *  V0.4    Nick    21/12/16    added against the clock mode
 * 
 */

// Global Variables
var page = "#pageMission";
var playerBoard = "#playerBoard";
var opponentBoard = "#computerBoard";
var opponentContainer = "#opponentContainer";

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

var shipsToPlace = new Array();

var totalShots = 0;
var totalHits = 0;
var totalHitsReceived = 0;

var opponentShipDetails = [
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
var playerShipDetails = [
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

$(document).ready(function () {

    initialise();
    runIntro();
});

function initialise() {

    boardSize = mission.boardSize;

    if (mission != null) {

        switch (mission.name) {

            case "last-stand":
                initLastStand();
                break;

            case "fog-of-war":
                initFogOfWar();
                break;

            case "hardcore":
                initHardcore();
                break;

            case "against-the-clock":
                initAgainstTheClock();
                break;
        }
    }
}

function initLastStand() {

    // last stand has one ship
    // all other aspects are as normal

    playerShipDetails = [
        {
            name: "Destroyer",
            size: 2
        }
    ];
}

function initHardcore() {

    // hardcore removes perks
    // all other aspects are as normal

    $(".perksCont").remove();
    $("#opponentContainer .shipsRemainingCont").remove();

    $.getScript("../../Scripts/Overrides/playerFireAtComputer.js");
}

function initFogOfWar() {

    // fog of war perk
    // removes the ability of seeing what enemy ships have been sunk

    $("#opponentContainer .shipsRemainingCont").remove();
    $.getScript("../../Scripts/Overrides/playerFireAtComputer.js");
}

function initAgainstTheClock() {

    $.getScript("../../Scripts/Overrides/againstTheClock.js");
}

function runIntro() {

    runText();
    runButtons();
}

function runText() {

    mission.text += "<br /><br />Do you accept this mission?";

    var chars = mission.text.split("");

    var text = "";
    var i = 0;

    var t = setInterval(function () {

        if (i >= chars.length - 1) {
            clearInterval(t);
        }

        text += chars[i];
        $("#intro #message p").html(text);
        i++;
    }, 50);
}

function runButtons() {

    $("#acceptMission").unbind("click").one("click", function () {

        $("#intro").fadeOut(500).promise().done(function () {

            $("#introOverlay").fadeOut(200);

            populateShips();
            initPlaceShips();

            difficulty = mission.difficulty.toLowerCase();

            game = new Game(mission.boardSize);
            playerBoardClass = game.getPlayerBoard();
            opponentBoardClass = game.getComputerBoard();
        });
    });
}

function populateShips() {

    var remainingShipsHtml = "";

    for (var i = 0; i < playerShipDetails.length; i++) {

        shipsToPlace.push(new Ship(playerShipDetails[i].name, playerShipDetails[i].size));

        remainingShipsHtml += "<li class='" + playerShipDetails[i].name + "'></li>";
    }
    
    $("#playerContainer " + boardExtras + " ul.remainingShips").html(remainingShipsHtml);

    remainingShipsHtml = "";

    for (var i = 0; i < opponentShipDetails.length; i++) {

        remainingShipsHtml += "<li class='" + opponentShipDetails[i].name + "'></li>";
    }
    
    $("#opponentContainer " + boardExtras + " ul.remainingShips").html(remainingShipsHtml);
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

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

function startGame() {

    window.onbeforeunload = confirmExit;

    // set the variable so other methods know the game has begun
    gameStarted = true;

    $(resetBoardButton).fadeOut(500).unbind("click");
    $(undoLastShipButton).fadeOut(500).unbind("click");

    $(boardExtras).fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    startGameExtra();

    // let the player have the first move
    updatePerks();
    playerMove();
}

function confirmExit() {
    return "If you leave the page, your game will not be saved";
}

function endGame(winner, finished) {

    endGameExtra();

    if (finished) {

        removeClicks();
        removeHovers();
        disablePerks();

        if (winner == "player") {

            alert("You win");
        } else {

            showOpponentShips();
        }
    }

    window.onbeforeunload = null;
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

        if (val.usesLeft <= 0) {
            perkHtml += "disabled ";
            val.usesLeft = 0;
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
        case "Mortar":
            initMortarPerk();
            break;
    }
}

function endPlayerPerk(skipTurn, perk) {

    var x = game.updatePlayerPerks(perk);

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
        showMessageTimeout("No moves found! Better luck next time...", 2000);
    }

    // allow player to now make a move
    endPlayerPerk(true, "Sonar");
}

function mortarAction(x, y) {

    var mortar = new Mortar(opponentBoardClass);

    var cells = mortar.action(x, y);

    console.log(cells);

    if (cells && cells.length == 3) {
        
        for (var i = 0; i < cells.length; i++) {

            boardFireAtOpponentCoordinate(cells[i].getX(), cells[i].getY());
        }
    }

    removeHovers();
    endPlayerPerk(true, "Mortar");
}

/******************************
 * 
 *      POST GAME EVENTS
 * 
******************************/

function showOpponentShips() {
    var remainingShips = opponentBoardClass.getFloatingShips();

    for (var i = 0; i < remainingShips.length; i++) {
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

/******************************
 * 
 *      BLANK FUNCTIONS
 * 
******************************/

function startGameExtra() {}

function endGameExtra() {}