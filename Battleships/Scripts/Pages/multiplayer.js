/**
 * Last Modified By: Dave MacDonald
 * 
 * V0.4     Nick        08/11/16    initial creation
 * V0.2     Nick        09/11/16    added the ability to create / leave room
 * V0.2.1   Dave        09/11/16    Create game bug fix
 * V0.3     Team        09/11/16    added more listeners and giving more feedback to user
 * V0.31    Nick        10/11/16    added in loader until the user connects to the server
 * V0.4     Nick        12/11/16    added timeout to join server, added the ability to join a game
 * V0.5     Nick        13/11/16    added necessary variables to be able to place ships - place ship functionality
 * V0.6     Nick        14/11/16    players can now fire at each other
 * V0.61    Nick        15/11/16    bug fixes
 * V0.7     Nick        15/11/16    ships now show when you sink them on the opponen'ts board. enemy firing now shows on your board
 * V0.71    Nick        15/11/16    removed logging
 * V0.72    Dave        16/11/16    Added win alert.
 * V0.73    Nick        16/11/16    changed win alert, added fire method on opponent board that was missing
 * V0.8     Nick        17/11/16    allow player to see their opponent's remaining ships after they lose. board resets when they leave the game 
 * V0.81    Nick        28/11/16    when finishing a game, it should now allow you to place ships and create a room
 * V0.82    Nick        28/11/16    remaining ships now shows
 * V0.9     Nick        28/11/16    added scoring modal
 * V0.91    Nick        28/11/16    scoring bug
 * V0.92    Nick        29/11/16    added incrementIncompleteGames
 * V0.93    Dave        30/11/16    added more info to games list
 * V1.0     Nick        02/12/16    dynamic board sizes and initial perks
 * V1.1     Nick        02/12/16    sonar perk integration
 * V1.2     Nick        02/12/16    bounce bomb perk integration
 * V1.21    Nick        03/12/16    bug fix where you couldn't create a game after cancelling
 * V1.22    Dave        05/12/16    bug fix where gameList wasn't being updated when a room was full
 * V1.23    Nick        05/12/16    bug fix - decrement incomplete games when your opponent leaves
 * V1.24    Nick        05/12/16    sonar multiplayer bug fix
 * V1.25    Nick        05/12/16    hide board extras on the reset board
 * V1.3     Nick        06/12/16    added mortar
 * V1.4     Nick        07/12/16    changed alerts to new functionality, fixed bug where new players showed NAN% for completion rate
 * V1.41    Nick        11/12/16    changed ajax links
 * V1.42    Nick        22/12/16    added hit <i> for destroy ship
 * V1.43    Nick        18/01/17    class missing off no games found
 * 
 */

// Connecting to socket.io //var socket = io.connect('http://40.68.102.207:3000');
//var socket = io.connect('https://battleships.online:3000', {secure: true});
var socket = io.connect('https://battleships-preprod.tk:3000', {secure: true});
//var socket = io.connect('http://localhost:3000'); // UNCOMMENT FOR LOCALHOST DEV


var game;
var host = false; //******* this is updated if they create a game ******
var playerBoardClass;
var opponentBoardClass;
var boardSizeStr;
var boardSize;

var userStats = null;

var page = "#subPagePlayGame";
var playerBoard = "#playerBoard";
var opponentBoard = "#opponentBoard";

var createRoomButton = "#createGame";
var createRoomButtonConf = "#createRoomButtonConf";
var createRoomButtonCancel = "#createRoomButtonCancel";
var createGameCont = "#createGameCont";
var cancelGameButton = "#cancelGame";

var backToMultiplayerButton = "#backToMultiplayer";

var boardExtras = ".boardExtras";

var startGameButton = "#playerReady";
var rotateShipButton = "#rotateShip";
var undoLastShipButton = "#undoLastShip";
var resetBoardButton = "#resetBoard";

var availableRooms = "#availableRooms";

var scoreModalOverlay = "#scoreModalOverlay";
var scoreModal = "#scoreModal";
var scoreModalTitle = scoreModal + " #resultTitle";

var totalShots;
var totalHits;
var totalHitsReceived;
var startTime;

// hard coded ships for the moment
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

var shipsToPlace = new Array();

$(document).ready(function() {

    showWaiting(true, "Connecting you, Please wait...");

    socket.emit("join", session.id);

    var timesFailed = 0;
    var timeout = setInterval(function () {
        socket.emit("join", session.id);
    }, 5000);

    socket.on("joinServerRepsonse", function(data) {
        if (data){
            showWaiting(false);
            clearInterval(timeout);
        } else {
            //alert("Failed to join server! :( Trying again in 5 seconds");
            //showWaiting(false);
            timesFailed++;
            showWaiting(true, "Failed to join server! Trying again in 5 seconds...<br/><br/> Times Failed: " + timesFailed);
        }
    });

    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });
});

getUserStats();
function getUserStats() {
    
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "multiplayerStats"
        },
        type: "post",
        success: function (data) {
            data = JSON.parse(data);

            userStats = data[0];
        },
        error: function () {

        }
    });
}

function changePage(page) {

    $(".subPage:not(" + page +")").fadeOut(200).promise().done(function () {

        if (page == "#subPagePlayGame") {
            $("#pageMultiplayer").addClass("birdsEyeView");
        } else {
            $("#pageMultiplayer").removeClass("birdsEyeView");
        }

        $(page).fadeIn(500);
    });
}

socket.on("playersOnline", function (num) {
    $("#playersOnline").html("Online (" + num + " Worldwide)");
});

socket.on("opponentName", function(data){
    $("#opponentName").html("Opponent: " + data);
});

//To show alerts from server
socket.on('alert', function(message){ // listens for alert emit from server.js
    //console.log(message);
});

socket.on('gameList', function (data) {

    var games = false;

    var returnText = "";
    
    for (var game in data) {

        if (data.hasOwnProperty(game)) {

            if (data[game].players.length != 2 && data[game].status == "available") {

                games = true;
                
                returnText += "<tr>";

                // username
                returnText += "<td>";
                returnText += data[game].name;
                returnText += "</td>";

                // board size
                returnText += "<td>";
                returnText += data[game].boardSize + " x " + data[game].boardSize;
                returnText += "</td>";

                // high score
                returnText += "<td>";
                returnText += data[game].hostHighScore;
                returnText += "</td>";

                // completion rate
                returnText += "<td>";
                returnText += data[game].hostCompletionRate + "%";
                returnText += "</td>";

                if (data[game].name != session.id) {

                    // button markup
                    returnText += "<td>";
                    returnText += "<button ";
                    returnText += "class='joinGame' "
                    returnText += "data-game='" + data[game].id + "'";
                    returnText += "data-size='" + data[game].boardSize + "'";
                    returnText += ">"
                    returnText += "Battle"
                    returnText += "</button>";
                    returnText += "</td>";
                }

                returnText += "</tr>";
            }
        } else {
            returnText += "<tr class='noGamesFound'><td colspan='4'>No games found!</td></tr>";
        }
    }

    if (!games) {
        returnText = "<tr class='noGamesFound'><td colspan='4'>No games found!</td></tr>";
    }

    $(availableRooms + " tbody").html(returnText);

    // click handlers for joining a game
    $(".joinGame").off("click").on("click", function () {
        
        var id = $(this).data("game");
        var size = $(this).data("size");

        joinGame(id, size);
    });
});

function createRoom() {

    $(createGameCont).fadeIn(500);

    $(createRoomButtonConf).unbind("click").one("click", function () {

        var completionRate = ((parseInt(userStats.gamesPlayed) / (parseInt(userStats.gamesPlayed) + parseInt(userStats.incompleteGames)))*100).toFixed(2);
        if (userStats.gamesPlayed == 0) {
            completionRate = 100;
        }
        var size = $("[name=size]:checked").val();
        var sizeInt = convertBoardSizeStrToInt(size);
        boardSize = sizeInt;
        boardSizeStr = size;

        data = {
            "name": session.id,
            "boardSize": sizeInt,
            "highScore": userStats.highScore,
            "completionRate": completionRate
        };

        socket.emit("createGame", data);

        $(createGameCont).fadeOut(500);
    });

    $(createRoomButtonCancel).off("click").one("click", function() {
        $(createGameCont).fadeOut(500);

        // re-add handler
        $(createRoomButton).off("click").one("click", function () {
            createRoom();
        });
    });
}

socket.on("createGameResponse", function (data) {

    if (data) { // if true/if exists

        host = true; // update the host variable
        var message = "You have created a game!<br/>Please wait for someone to join, and good luck!<br/><br/>";

        message += "<button id='cancelGame'>Cancel</button>";

        showWaiting(true, message);

        $(document).off("click").one("click", cancelGameButton, function () {
            $(cancelGameButton).off("click");

            socket.emit("leaveGame");

            showWaiting(false);

            $(createRoomButton).off("click").one("click", function () {
                createRoom();
            });
        });
    } else {

        showMessageTimeout("Failed to Create Game! Please try again...", 2000);

        $(createRoomButton).off("click").one("click", function () {
            createRoom();
        });
    }
});

function joinGame(id, size) {

    host = false;

    boardSize = size;
    boardSizeStr = convertBoardSizeIntToStr(size);

    // remove click handler
    $(".joinGame").off("click");

    // join the game
    socket.emit("joinGame", id);

    showWaiting(true, "Connecting you to the game, good luck!");
}

socket.on("joinGameResponse", function (joined) {

    showWaiting(false);

    if (joined) {

        changePage("#subPagePlayGame");
        $(backToMultiplayerButton).hide();
        initGame();

    } else {

        showMessageTimeout("We couldn't join you to the game! Please try again...");
    }
});

function initGame() {

    resetMultiplayerBoard();
    incrementIncompleteGames();

    shipsToPlace = new Array();

    populateShips();
    initPlaceShips();

    game = new Game(boardSize);
    playerBoardClass = game.getPlayerBoard();
    opponentBoardClass = game.getComputerBoard();
}

socket.on("gameReady", function (data) {

    for (var i = 0; i < data.length; i++) {
        var ship = data[i];

        // set up ship object
        var shipObj = new Ship(ship.name, ship.size);

        // change orientation if necessary
        if (ship.orientation != 1) {
            shipObj.changeOrientation();
        }

        var shipCoords = ship.coordinates;

        // place the ship on the board
        opponentBoardClass.placeShip(shipObj, shipCoords[0].x, shipCoords[0].y);
    }

    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!");

    $(boardExtras).fadeIn(500);
    updatePerks();

    totalShots = 0;
    totalHits = 0;
    totalHitsReceived = 0;
    startTime = new Date();
});

socket.on("playerToStart", function(data) {

    showWaiting(false);
    
    if (data) {
         playerMove();
    }
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

    $(page + " .boardExtrasContainer ul.remainingShips").html(remainingShipsHtml);
}

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
        $(resetBoardButton).fadeOut(500).unbind("click");
        $(undoLastShipButton).fadeOut(500).unbind("click");

        // emit to server that player is ready
        showWaiting(true, "You're ready to play!<br/><br/>Please wait for your opponent to place their ships");

        var myShipObjs = playerBoardClass.getShipsPlaced();
        var myShips = new Array();

        for (var i = 0; i < myShipObjs.length; i++) {
            myShips.push(myShipObjs[i].toObject());
        }

        if (host) {
            socket.emit("hostReady", myShips);
        } else{
            socket.emit("playerReady", myShips);
        }
    });
}

/******************************
 * 
 *        BOARD FIRING
 * 
******************************/

function playerMove() {

    $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

        var $cell = $(this);

        var canFire = boardFireHover($cell);

        if (canFire) {

            $cell.unbind("click").one("click", function () {

                fireAtPlayer($cell);
            });
        } else {
            cleanupHoverClasses();
            removeClicks();
        }

        $cell.bind("mouseleave", function () {
            cleanupHoverClasses();
            removeClicks();
        });
    });
}

function fireAtPlayer($cell) {

    if ($cell) {

        removeHovers();
        removeClicks();
        cleanupHoverClasses();

        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        totalShots++;

        socket.emit("fire", {
            x: x,
            y: y
        });

        showWaiting(true, "Firing at opponent's board!", 0.4);
    }
}

socket.on("recordHit", function (data) {

    if (data == "skip") {
        playerMove();
        showWaiting(false);
    } else if (data) {

        var x = data.x;
        var y = data.y;

        var coordinate = boardFireAtSelf(x, y);

        socket.emit("recordHitResponse", {
            coordinate: coordinate
        });

        if (!playerBoardClass.isViable()) {
            socket.emit("lostGame");
        } else {
            playerMove();
        }

        showWaiting(false);
    }
});

function boardFireAtSelf(x, y) {

    var hit = playerBoardClass.fire(x, y);

    if (hit) {
        totalHitsReceived++;
    }
    
    var coord = playerBoardClass.getCoordinateAt(x, y);
    var coordinate = coord.toObject();

    $(page + " " + playerBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

    var ship = coord.getShip(x, y);

    if (ship) {
        if (ship.isDestroyed()) {
            $("#playerContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
        }
    }

    return coordinate;
}

socket.on("fireResponse", function (data) {
    showWaiting(false);

    var coord = data.coordinate;

    // fire at board
    boardFireAtOpponent(coord.x, coord.y);

    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!", 0.4);
});

function boardFireAtOpponent(x, y) {
    var hit = opponentBoardClass.fire(x, y);

    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

    if (hit) {

        totalHits++;

        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("containsShip");

        var coordObj = opponentBoardClass.getCoordinateAt(x, y);

        var ship = coordObj.getShip();

        // only populated if destroyed
        if (ship) {
            
            if (ship.isDestroyed()) {
                setShipAttributesOnBoard(opponentBoard, ship);

                $("#opponentContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }
    }
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
        socket.emit("fire", "skip")
        showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!", 0.4);
    }
}

/******************************
 * 
 *        PERK ACTIONS
 * 
******************************/

socket.on("runPerk", function (data) {

    switch (data.perk) {
        case "Sonar":
            runSonarPerk(data.x, data.y);
            break;
        case "Bounce_Bomb":
            runBounceBombPerk(data.x, data.y, data.orientation);
            break;
        case "Mortar":
            runMortarPerk(data);
            break;
    }
});

socket.on("usePerkResponse", function (data) {

    switch (data.perk) {
        case "Sonar":
            responseSonarPerk(data.x, data.y);
            break;
        case "Bounce_Bomb":
            responseBounceBombPerk(data);
            break;
        case "Mortar":
            responseMortarPerk(data);
            break;
    }
});

function sonarAction(x, y) {

    var data = {
        perk: "Sonar",
        x: x,
        y: y
    };

    socket.emit("usePerk", data);
}

function runSonarPerk(x, y) {

    var sonar = new Sonar(playerBoardClass);

    var cell = sonar.action(x, y);

    var data = {
        perk: "Sonar",
        x: cell ? cell.getX() : null,
        y: cell ? cell.getY() : null 
    };

    if (cell) {
        $(page + " " + playerBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");
    }

    socket.emit("runPerkResponse", data);
}

function responseSonarPerk(x, y) {

    if (x != null && y != null) {

        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("sonarShipLocation");
    } else {

        showMessageTimeout("No moves found! Better luck next time...", 3000);
    }

    endPlayerPerk(true, "Sonar");
}

function bounceBombAction(x, y, orientation) {

    var data = {
        perk: "Bounce_Bomb",
        x: x,
        y: y,
        orientation: orientation
    };

    socket.emit("usePerk", data);
}

function runBounceBombPerk(x, y, orientation) {

    var bounceBomb = new BouncingBomb(opponentBoardClass);

    var num = bounceBomb.action(x, y, orientation);

    boardFireAtSelf(x, y);

    if (num == 2) {

        if (orientation == 1) {
            boardFireAtSelf(x, y - 1);
        } else {
            boardFireAtSelf(x + 1, y);
        }
    }

    var data = {
        perk: "Bounce_Bomb",
        num: num,
        orientation: orientation,
        x: x,
        y: y
    };

    socket.emit("runPerkResponse", data);
}

function responseBounceBombPerk(data) {

    boardFireAtOpponent(data.x, data.y);

    if (data.num == 2) {

        if (data.orientation == 1) {
            boardFireAtOpponent(data.x, data.y - 1);
        } else {
            boardFireAtOpponent(data.x + 1, data.y);
        }
    }

    endPlayerPerk(true, "Bounce_Bomb");
}

function mortarAction(x, y) {
    
    var data = {
        perk: "Mortar",
        x: x,
        y: y
    };

    socket.emit("usePerk", data);
}

function runMortarPerk(data) {

    var mortar = new Mortar(playerBoardClass);

    var cellObjs = mortar.action(data.x, data.y);

    var cells = new Array();

    for (var i = 0; i < cellObjs.length; i++) {

        cells.push(cellObjs[i].toObject());

        boardFireAtSelf(cellObjs[i].getX(), cellObjs[i].getY());
    }

    var data = {
        perk: "Mortar",
        cells: cells
    };

    socket.emit("runPerkResponse", data);
}

function responseMortarPerk(data) {

    var cells = data.cells;

    for (var i = 0; i < cells.length; i++) {
        boardFireAtOpponent(cells[i].x, cells[i].y);
    }

    endPlayerPerk(true, "Mortar");
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

socket.on("lostGameResponse", function (lost) {
    
    showWaiting(false);

    if (lost) {
        showRemainingShips();
        statisticsAjax(false);
    } else {
        statisticsAjax(true);
        winAjax();
    }

    $(backToMultiplayerButton).fadeIn(500, function () {
        $(backToMultiplayerButton).off("click").one("click", function () {
            $(backToMultiplayerButton).fadeOut(500);

            // allow user to once again create a room
            $(createRoomButton).off("click").one("click", function () {
                createRoom();
            });

            changePage("#subPageRoom");

            resetMultiplayerBoard();
        });
    });
});

socket.on("playerLeftResponse", function (data) {

    if (data) {
        showWaiting(false);

        changePage("#subPageRoom");
        decrementIncompleteGames();
        resetMultiplayerBoard();

        showMessageTimeout("Your opponent has left the game! Taking you back to the menu", 3000);
    }
});

function showRemainingShips() {
    var remainingShips = opponentBoardClass.getFloatingShips();

    for (var i = 0; i < remainingShips.length; i++) {
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

function resetMultiplayerBoard() {

    $(".board").attr("data-size", boardSizeStr);

    var tableHtml = "<tbody>";

    for (var i = 0; i < boardSize; i++) {

        tableHtml += "<tr>";

        for (var x = 0; x < boardSize; x++) {
            tableHtml += "<td><i class='hit'></i></td>";
        }

        tableHtml += "</tr>";
    }

    tableHtml += "</tbody>";

    $(".board").html(tableHtml);

    $(boardExtras).hide();

    // allow user to once again create a room
    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });
}

function statisticsAjax(won) {

    var endTime = new Date();
    var playingTime = (endTime.getTime() - startTime.getTime()) / 1000;
    
    /*** SCORING ***/
    var boardSizeBonus = 0;
    
    switch (boardSize) {
        case 10:
            boardSizeBonus = 0;
            break;
        case 15:
            boardSizeBonus = 100;
            break;
        case 20:
            boardSizeBonus = 200;
            break;
    }

    var baseScore = 100;
    var negativeScorePerHitReceived = 5;
    var negativeScorePerShotMissed = 1;
    var positiveScorePerShotHit = 5;
    var winBonus = 0;
    var timeBonusPerSecond = 1;

    var shotsMissed = totalShots - totalHits;
    var timeBonus = 0;

    if (playingTime < 300) {
        var timeBonus = (300 - playingTime) * timeBonusPerSecond;
    }

    if (won) {
        winBonus = 100;
    }

    var totalHitRScore = (totalHitsReceived * negativeScorePerHitReceived);
    var shotsMissedScore = (shotsMissed * negativeScorePerShotMissed);
    var totalHitScore = (totalHits * positiveScorePerShotHit);
    var accuracy = (totalHits/totalShots) *100;

    var gameScore = baseScore 
                    - totalHitRScore
                    - shotsMissedScore
                    + totalHitScore 
                    + timeBonus 
                    + winBonus
                    + boardSizeBonus;
    /*** END SCORING ***/

    showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus, boardSizeBonus);

    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
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

    //Check if medal conditions are met
    $.ajax({
        url: "../../Content/Ajax/medalAjax.php",
        data: {
            action: "checkMedalConditions",
            difficulty: "multiplayer",
            winner: "player",
            boardSize: boardSize,
            accuracy: accuracy,
            numberOfHits: totalHitsReceived
        },
        type: "post"
    });

    window.onbeforeunload = null;
}

function incrementIncompleteGames() {
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "incrementIncompleteGames"
        },
        type: "post"
    });
}

function decrementIncompleteGames() {
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "decrementIncompleteGames"
        },
        type: "post"
    });
}

function winAjax() {
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "recordWin"
        },
        type: "post"
    });
}

function showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus, boardSizeBonus) {

    won = winBonus != 0;

    $(scoreModal + " span").hide();

    $(scoreModalTitle).html(won ? "You Won!" : "You Lost!");

    $(scoreModalOverlay).fadeIn(200);
    $(scoreModal).fadeIn(500);

    $("#baseScore span").fadeIn(500);

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
        var sign = boardSizeBonus < 0 ? "" : "+ ";
        $(scoreModal + " #boardSizeBonus span").html(sign + boardSizeBonus + "pts").fadeIn(500);
    }, 3000);

    setTimeout(function () {
        $(scoreModal + " #total span").html(gameScore.toFixed(2) + "pts").fadeIn(500);
    }, 3500);

    $("#closeModal").off("click").one("click", function () {
        $(scoreModalOverlay).fadeOut(200);
        $(scoreModal).fadeOut(500);
    });

    $("#scoreBackToMultiplayer").off("click").one("click", function () {

        // allow user to once again create a room
        $(createRoomButton).off("click").one("click", function () {
            createRoom();
        });

        changePage("#subPageRoom");

        resetMultiplayerBoard();

        $(backToMultiplayerButton).hide();
        $(scoreModalOverlay).fadeOut(200);
        $(scoreModal).fadeOut(500);
    });
}