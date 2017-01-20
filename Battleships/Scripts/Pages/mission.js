/**
 * 
 *  V0.1    Nick    19/12/16    initial creation, last-stand mode
 *  V0.2    Nick    21/12/16    added hardcore mode
 *  V0.3    Nick    21/12/16    added fog of war mode
 *  V0.4    Nick    21/12/16    added against the clock mode
 *  V0.5    Nick    10/01/17    added pearl harbour
 *  V0.6    Nick    17/01/17    initial waves
 *  V0.7    Nick    17/01/17    island warfare added
 *  V0.8    Nick    18/01/17    outro implemented
 *  V0.81   Nick    20/01/17    final comments added
 * 
 */

// Global Variables
var page = "#pageMission";
var playerContainer = "#playerContainer";
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

// opponent / player ship details - normal
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

/**
 * Function to run when DOM is ready
 */
$(document).ready(function () {

    runIntro();
    initialise();
});

/**
 * Function to initialise the specific mission
 */
function initialise() {

    // set the board size
    boardSize = mission.boardSize;

    // check that a mission has been passed
    if (mission != null) {

        // switch the mission and run the specific initialise
        switch (mission.name) {

            case "fog-of-war":
                initFogOfWar();
                break;

            case "hardcore":
                initHardcore();
                break;

            case "last-stand":
                initLastStand();
                break;

            case "against-the-clock":
                initAgainstTheClock();
                break;

            case "pearl-harbour":
                initPearlHarbour();
                break;

            case "island-warfare":
                initIslandWarfare();
                break;
        }
    }
}

/**
 * Function to initialise last stand mission
 */
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

/**
 * Function to initialise hardcore mission
 */
function initHardcore() {

    // hardcore removes perks
    // all other aspects are as normal

    $(".perksCont").remove();
    $("#opponentContainer .shipsRemainingCont").remove();

    // get the appropriate script
    $.getScript("../../Scripts/Overrides/playerFireAtComputer.js");
}

/**
 * Function to initialise fog of war mission
 */
function initFogOfWar() {

    // fog of war perk
    // removes the ability of seeing what enemy ships have been sunk

    $("#opponentContainer .shipsRemainingCont").remove();

    // get appropriate script
    $.getScript("../../Scripts/Overrides/playerFireAtComputer.js");
}

/**
 * Function to initialise against the clock mission
 */
function initAgainstTheClock() {

    // load appropriate script
    $.getScript("../../Scripts/Overrides/againstTheClock.js");
}

/**
 * Function to initialise pearl harbour mission
 */
function initPearlHarbour() {

    // opponent has more ships than normal
    opponentShipDetails = [
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
        },
        {
            name: "Fighter-1",
            size: 1
        },
        {
            name: "Fighter-2",
            size: 1
        },
        {
            name: "Fighter-3",
            size: 1
        },
        {
            name: "Fighter-4",
            size: 1
        }
    ];

    $(opponentContainer + " .shipsRemainingCont").addClass("pearlHarbour");
}

/**
 * Function to initialise island warfare
 */
function initIslandWarfare() {

    // add class to the player board so that it shows an island
    $(playerContainer + " .mapCont .map").addClass("island");

    // coordinates that are out of bounds
    var landCoords = [
        { x: 8, y: 3 },
        { x: 9, y: 3 },
        { x: 10, y: 3 },

        { x: 6, y: 4 },
        { x: 7, y: 4 },
        { x: 8, y: 4 },
        { x: 9, y: 4 },
        { x: 10, y: 4 },

        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
        { x: 9, y: 5 },
        { x: 10, y: 5 },
        { x: 11, y: 5 },

        { x: 7, y: 6 },
        { x: 8, y: 6 },
        { x: 9, y: 6 },
        { x: 10, y: 6 },
        { x: 11, y: 6 },
        { x: 12, y: 6 },

        { x: 7, y: 7 },
        { x: 8, y: 7 },
        { x: 10, y: 7 },
        { x: 11, y: 7 },
        { x: 12, y: 7 },

        { x: 11, y: 8 },
        { x: 12, y: 8 },
        { x: 13, y: 8 }
    ];

    // override existing click handler
    $("#acceptMission").unbind("click").one("click", function () {

        $("#intro").fadeOut(500).promise().done(function () {

            $("#introOverlay").fadeOut(200);

            populateShips();
            initPlaceShips();

            difficulty = mission.difficulty.toLowerCase();

            game = new Game(mission.boardSize, landCoords);
            playerBoardClass = game.getPlayerBoard();
            opponentBoardClass = game.getComputerBoard();
        });
    });
}

/**
 * Function that runs all intro functions
 */
function runIntro() {

    runText();
    runButtons();
}

/**
 * Function to show text on the intro
 */
function runText() {

    mission.text += "<br/><br/>Do you accept this mission?";

    var chars = mission.text.split("");

    var text = "";
    var i = 0;

    // set interval to show each character
    var t = setInterval(function () {

        // clear interval when it reaches the end
        if (i >= chars.length - 1) {
            clearInterval(t);
        }

        text += chars[i];
        $("#intro #message p").html(text);
        i++;

    }, 50);
}

/**
 * Function to show and handle the buttons
 */
function runButtons() {

    $("#acceptMission").unbind("click").one("click", function () {

        $("#intro").fadeOut(500).promise().done(function () {

            $("#introOverlay").fadeOut(200);

            populateShips();
            initPlaceShips();

            if (difficulty == null) {
                difficulty = mission.difficulty.toLowerCase();  
            }

            game = new Game(mission.boardSize);
            playerBoardClass = game.getPlayerBoard();
            opponentBoardClass = game.getComputerBoard();
        });
    });
}

/**
 * Function to populate the remaining ships and ships to place variable
 */
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

/**
 * Function runs once ships have been placed
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
 * Function to start game
 */
function startGame() {

    // add unload message
    window.onbeforeunload = confirmExit;

    // set the variable so other methods know the game has begun
    gameStarted = true;

    // hide reset / undo buttons and remove click handler
    $(resetBoardButton).fadeOut(500).unbind("click");
    $(undoLastShipButton).fadeOut(500).unbind("click");

    // show board extras
    $(boardExtras).fadeIn(500);

    // place the ships for the AI
    placeAIShips();

    startGameExtra();

    // let the player have the first move
    updatePerks();
    playerMove();
}

/**
 * Message when unloading
 */
function confirmExit() {
    return "If you leave the page, your game will not be saved";
}

/**
 * Function to run when game has ended
 * 
 * @param   {string}    winner      player who won the game
 * @param   {boolean}   finished    whether the game has actually finished
 */
function endGame(winner, finished) {

    // just in case there is an end game extra
    finished = endGameExtra(winner, finished);

    // check that the game has actually finished
    if (finished) {

        // remove all clicks, hovers and disable perks
        removeClicks();
        removeHovers();
        disablePerks();

        // run the outro
        runOutro(winner);

        // if the playr has won
        if (winner == "player") {

            // check that the mission isn't null
            if (mission != null) {

                var medalId;

                // find which medal to unlock
                switch (mission.name) {

                    case "fog-of-war":
                        medalId = 13;
                        break;

                    case "hardcore":
                        medalId = 14;
                        break;

                    case "last-stand":
                        medalId = 15;
                        break;

                    case "against-the-clock":
                        medalId = 16;
                        break;

                    case "pearl-harbour":
                        medalId = 17;
                        break;

                    case "island-warfare":
                        medalId = 18;
                        break;
                }

                // unlock the medal
                $.ajax({
                    url: "../../Content/Ajax/medalAjax.php",
                    data: {
                        action: "unlockMedal",
                        medalId: medalId,
                    },
                    type: "post"
                });
            }
        } else {

            // if the player lost, show the opponent ships
            showOpponentShips();
        }
    }

    // remove the unload messages
    window.onbeforeunload = null;
}

/**
 * Function to run the outro
 * 
 * @param   {string}    winner  the player who won the game
 */
function runOutro(winner) {

    // reset the intro, and prepare it to be an outro
    $("#intro #message p").html("");
    $("#introButtons").hide();
    $("#outroButtons").show();

    // fade in the overlay
    $("#introOverlay").fadeIn(200).promise().done(function() {

        // fade in the intro container
        $("#intro").fadeIn(500).promise().done(function () {

            // set the text
            var endText = winner == "player" ?
                "You Won! <br/><br/> Insert motivational speech about how well you did"
                :
                "You Lost! <br/><br/> Insert motivational speech about how to get better";

            // split the string into individual characters
            var chars = endText.split("");

            var text = "";
            var i = 0;

            // initialise the interval
            var t = setInterval(function () {

                // clear the interval if characters are exhausted
                if (i >= chars.length - 1) {
                    clearInterval(t);
                }

                text += chars[i];
                $("#intro #message p").html(text);
                i++;

            }, 50);
        });
    });
}

/******************************
 * 
 *           PERKS
 * 
 ******************************/

/**
 * Function to update the perks for the player
 */
function updatePerks() {

    // get the available perks from game class
    var perks = game.getPlayerPerksAvailable();

    // initialise the HTML to be an empty string
    var perkHtml = "";

    // iterate through each perk
    $.each(perks, function (i, val) {

        // replace '-' with ' '
        var split = i.split("_");
        split = split.join(" ");

        // open li tag
        perkHtml += "<li>";

        // open button tag
        perkHtml += "<button ";
        perkHtml += "class='button perk' ";
        perkHtml += "data-perk='" + i + "' ";

        // if no uses left, disable the button
        if (val.usesLeft <= 0) {
            perkHtml += "disabled ";
            val.usesLeft = 0;
        }

        // close the opening button tag
        perkHtml += ">";

        // insert name and uses left for button
        perkHtml += split;
        perkHtml += " " + val.usesLeft;

        // close button tag
        perkHtml += "</button>";

        // close li tag
        perkHtml += "</li>";
    });

    // publish the HTML to the perks
    $("#playerContainer .perks").html(perkHtml);

    // add a click handler to enabled perks
    $("#playerContainer .perk:not(:disabled)").off("click").one("click", function () {

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
 * 
 * @param   {string}    perk    the perk that is being used
 */
function runPlayerPerk(perk) {

    // stop user from using other perks
    disablePerks();

    // find which perk to initialise
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
 * Function that is called at the end of each perk
 * 
 * @param   {boolean}   skipTurn    whether the perk should count as a move
 * @param   {string}    perk        what perk has been used
 */
function endPlayerPerk(skipTurn, perk) {

    // update the perks available to decrement
    var x = game.updatePlayerPerks(perk);

    // update the HTML to let the user know how many they have left
    updatePerks();

    if (skipTurn) {

        AIMove();
    } else {
        
        playerMove();
    }
}

/**
 * Function that runs the functionality of the bounce bomb
 * 
 * @param   {int}   x               the x value
 * @param   {int}   y               the y value
 * @param   {int}   bbOrientation   the orientation of the bounce bomb
 */
function bounceBombAction(x, y, bbOrientation) {

    // put bounce bomb to a variable
    var bounceBomb = new BouncingBomb(opponentBoardClass);

    // number of moves from the bounce bomb
    var num = bounceBomb.action(x, y, bbOrientation);

    // fire at the initial coordinate
    boardFireAtOpponentCoordinate(x, y);

    // if there are 2 valid moves, fire at the appropriate coordinate
    if (num == 2) {

        if (bbOrientation == 1) {
            
            boardFireAtOpponentCoordinate(x, y - 1);
        } else {
            
            boardFireAtOpponentCoordinate(x + 1, y);
        }
    }

    // remove any existing hovers
    removeHovers();

    // end the perk
    endPlayerPerk(true, "Bounce_Bomb");
}

/**
 * Function that runs the functionality of the sonar
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function sonarAction(x, y) {

    // put the sonar class to a variable
    var sonar = new Sonar(opponentBoardClass);

    // get the potential cell that the sonar has found
    var cell = sonar.action(x, y);

    // if it has found a cell
    if (cell) {

        // show the sonar location on the appropriate coordinate
        $(page + " " + opponentBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");

    } else {

        // alert the player that a move has not been found
        showMessageTimeout("No moves found! Better luck next time...", 2000);
    }

    // end the perk
    endPlayerPerk(true, "Sonar");
}

/**
 * Function that runs the functionality of the mortar
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function mortarAction(x, y) {

    // put the mortar class to a variable
    var mortar = new Mortar(opponentBoardClass);
    
    // get the coordinates from the mortar action
    var cells = mortar.action(x, y);

    // check that there are cells, and only 3
    if (cells && cells.length == 3) {
        
        // interate through the coordinates
        for (var i = 0; i < cells.length; i++) {

            // fire at the individual coordinate
            boardFireAtOpponentCoordinate(cells[i].getX(), cells[i].getY());
        }
    }

    // remove the hover handlers
    removeHovers();

    // end the perk
    endPlayerPerk(true, "Mortar");
}

/******************************
 * 
 *      POST GAME EVENTS
 * 
******************************/

/**
 * Function to show the opponent ships
 */
function showOpponentShips() {

    // get the ships that haven't already been shown
    var remainingShips = opponentBoardClass.getFloatingShips();

    // iterate through the ships
    for (var i = 0; i < remainingShips.length; i++) {

        // put the ships on the board
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

/******************************
 * 
 *      BLANK FUNCTIONS
 * 
******************************/

/**
 * Blank function that can be overriden
 */
function startGameExtra() {}

/**
 * Function designed to be overriden
 * 
 * @param   {string}    winner      player who has won
 * @param   {boolean}   finished    whether the game has actually finished
 * 
 * @returns {boolean}               whether the game has actually finished
 */
function endGameExtra(winner, finished) {

    return finished
}