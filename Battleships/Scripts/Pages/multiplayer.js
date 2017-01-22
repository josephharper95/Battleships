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
 * V1.44    Nick        20/01/17    final comments added
 * 
 */

// Connecting to socket.io //var socket = io.connect('http://40.68.102.207:3000');
var socket = io.connect('https://battleships.online:3000', {secure: true});
//var socket = io.connect('https://battleships-preprod.tk:3000', {secure: true});
//var socket = io.connect('http://localhost:3000'); // UNCOMMENT FOR LOCALHOST DEV

// global variables
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

/**
 * Function called when the DOM is ready
 */
$(document).ready(function() {

    // show the waiting loader while connecting
    showWaiting(true, "Connecting you, Please wait...");
    
    // get the user statistics
    getUserStats();

    // join the socket
    socket.emit("join", session.id);

    // track the number of times failed for the user
    var timesFailed = 0;

    // set an interval for the joining of the session to run every 5 seconds
    var timeout = setInterval(function () {

        socket.emit("join", session.id);
    }, 5000);

    // handle the joining of the server
    socket.on("joinServerRepsonse", function (data) {

        // check that data has come back
        if (data) {

            // hide the waiting loader and clear the interval
            showWaiting(false);
            clearInterval(timeout);
        } else {
            
            // increment the times failed
            timesFailed++;

            // carry the waiting loader on, but increment the number of times failed
            showWaiting(true, "Failed to join server! Trying again in 5 seconds...<br/><br/> Times Failed: " + timesFailed);
        }
    });

    // allow the user to create a room by adding a click handler
    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });
});

/**
 * Function to get the user statistics. Used for showing them when user creates room
 */
function getUserStats() {
    
    // run ajax
    $.ajax({
        url: "../../Content/Ajax/statisticsAjax.php",
        data: {
            action: "multiplayerStats"
        },
        type: "post",
        success: function (data) {

            // parse the data to JSON
            data = JSON.parse(data);

            // set variable to be the stats
            userStats = data[0];
        },
        error: function () {

            // currently nothing at the moment
        }
    });
}

/**
 * Function to change page
 * 
 * @param   {string}    page    the subpage that wants to be shown
 */
function changePage(page) {

    // fade out all pages that aren't the page that wants to be shown
    $(".subPage:not(" + page +")").fadeOut(200).promise().done(function () {

        // if the page to be shown is the game, add birds eye view. if not, remove it
        if (page == "#subPagePlayGame") {

            $("#pageMultiplayer").addClass("birdsEyeView");
        } else {

            $("#pageMultiplayer").removeClass("birdsEyeView");
        }

        $(page).fadeIn(500);
    });
}

//************************************
//************************************
//          SOCKET FUNCTIONS
//************************************
//************************************

/**
 * Function that refreshes how many players are online
 * 
 * @param   {number}    num     number of players
 */
socket.on("playersOnline", function (num) {

    $("#playersOnline").html("Online (" + num + " Worldwide)");
});

/**
 * Function that gets the player's opponent's name
 * 
 * @param   {string}    data    the opponent's name
 */
socket.on("opponentName", function(data) {

    $("#opponentName").html("Opponent: " + data);
});

/**
 * Function that gets a list of all games waiting for someone to join
 * 
 * @param   {Array}     data    the list of games
 */
socket.on('gameList', function (data) {

    // set games available to be false
    var gamesAvailable = false;

    // initialise the HTML to be an empty string
    var returnText = "";
    
    // iterate through the available games
    for (var game in data) {

        // validation check
        if (data.hasOwnProperty(game)) {

            // validation check that the game doesn't have 2 players, and that the status is available
            if (data[game].players.length != 2 && data[game].status == "available") {

                // make sure the games available is set to true
                gamesAvailable = true;
                
                // open tr tag
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

                // do not allow the user to join their own game
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

                // close tr tag
                returnText += "</tr>";
            }
        } else {

            // set the games to none available
            returnText += "<tr class='noGamesFound'><td colspan='4'>No games found!</td></tr>";
        }
    }

    if (!gamesAvailable) {

        // set the game to none available
        returnText = "<tr class='noGamesFound'><td colspan='4'>No games found!</td></tr>";
    }

    // public the HTML to the DOM
    $(availableRooms + " tbody").html(returnText);

    // click handlers for joining a game
    $(".joinGame").off("click").on("click", function () {
        
        // set relevant variables
        var id = $(this).data("game");
        var size = $(this).data("size");

        // join the game
        joinGame(id, size);
    });
});

/**
 * Function that is called when user has tried to create a game
 * 
 * @param   {boolean}   data    whether the room has been created
 */
socket.on("createGameResponse", function (data) {

    // if the game has been successfully created
    if (data) {

        // player is the host
        host = true;

        // message to player
        var message = "You have created a game!<br/>Please wait for someone to join, and good luck!<br/><br/>";

        // add a cancel button to the create game
        message += "<button id='cancelGame'>Cancel</button>";

        // show the message loader
        showWaiting(true, message);

        // add a click handler to the cancel button
        $(document).off("click").one("click", cancelGameButton, function () {

            // take the click handler off
            $(cancelGameButton).off("click");

            // let the socket know that the user has left the game
            socket.emit("leaveGame");

            // remove the loader
            showWaiting(false);

            // allow the user to create a room again
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

/**
 * Function that is called when the user has tried to join a game
 * 
 * @param   {boolean}   joined  whether the player has successfully joined
 */
socket.on("joinGameResponse", function (joined) {

    // hide the loader
    showWaiting(false);

    // if successfully joined
    if (joined) {

        // change the page to the board
        changePage("#subPagePlayGame");

        // remove back to multiplayer button
        $(backToMultiplayerButton).hide();

        // initialise the game
        initGame();

    } else {

        // show error message
        showMessageTimeout("We couldn't join you to the game! Please try again...");
    }
});

/**
 * Function that is called when both players have placed their ships and are ready
 * 
 * @param   {Array}     data    the list of opponent ships
 */
socket.on("gameReady", function (data) {

    // iterate through the ships
    for (var i = 0; i < data.length; i++) {

        // put individual ship to variable
        var ship = data[i];

        // set up ship object
        var shipObj = new Ship(ship.name, ship.size);

        // change orientation if necessary
        if (ship.orientation != 1) {

            shipObj.changeOrientation();
        }

        // put coords to variable
        var shipCoords = ship.coordinates;

        // place the ship on the board
        opponentBoardClass.placeShip(shipObj, shipCoords[0].x, shipCoords[0].y);
    }

    // let the player know that the opponent is making their move
    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!");

    // show the remaining ships and perks
    $(boardExtras).fadeIn(500);

    // update the perks
    updatePerks();

    // set statistic values
    totalShots = 0;
    totalHits = 0;
    totalHitsReceived = 0;
    startTime = new Date();
});

/**
 * Function that is called when the game is ready, and the player is to make the first move
 * 
 * @param   {boolean}   data    confirms the player is to start
 */
socket.on("playerToStart", function(data) {

    // hide the loader
    showWaiting(false);
    
    // validation check
    if (data) {

        // run player move
        playerMove();
    }
});

/**
 * Function to record a hit received from the opponent
 * 
 * @param   {Coordinate}    data    coordinate that the opponent has fired on
 */
socket.on("recordHit", function (data) {

    // if the go needs to be skipped (ie. when a perk is used)
    if (data == "skip") {

        // hand the turn over to the player
        playerMove();
        showWaiting(false);

    // validation check
    } else if (data) {

        // set x and y variables
        var x = data.x;
        var y = data.y;

        // get the coordinate object from firing at self
        var coordinate = boardFireAtSelf(x, y);

        // send the coordinate to the opponent
        socket.emit("recordHitResponse", {
            coordinate: coordinate
        });

        // check that the board is viable
        if (playerBoardClass.isViable()) {

            // time for player's move
            playerMove();
        } else {
            
            // if game over, player has lost
            socket.emit("lostGame");
        }

        // hide loader
        showWaiting(false);
    }
});

/**
 * Function to record the outcome of a hit to the opponent
 */
socket.on("fireResponse", function (data) {

    // hide loader
    showWaiting(false);

    // get the coordinate
    var coord = data.coordinate;

    // fire at board
    boardFireAtOpponent(coord.x, coord.y);

    // show loader
    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!", 0.4);
});

/**
 * Function that is called when the opponent runs a perk
 * 
 * @param   {Object}    data    object containing information for perks
 */
socket.on("runPerk", function (data) {

    // switch perk and run appropriate function
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

/**
 * Function that is called when player runs a perk and user sends response
 * 
 * @param   {Object}    data    object containing information for perks
 */
socket.on("usePerkResponse", function (data) {

    // switch perk and run appropriate function
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

/**
 * Function that is run at the end of the game as to whether the user has won or not
 * 
 * @param   {boolean}   lost    whether user has lost
 */
socket.on("lostGameResponse", function (lost) {
    
    // hide loader
    showWaiting(false);

    // if player loses, show remaining ships and run stats
    if (lost) {
        showRemainingShips();
        statisticsAjax(false);

    // if player wins, run stats and win ajax
    } else {
        statisticsAjax(true);
        winAjax();
    }

    // show the back to multiplayer button so that the user can join or create a new game
    $(backToMultiplayerButton).fadeIn(500, function () {

        // and a click handler
        $(backToMultiplayerButton).off("click").one("click", function () {

            // hide the button
            $(backToMultiplayerButton).fadeOut(500);

            // allow user to once again create a room
            $(createRoomButton).off("click").one("click", function () {
                createRoom();
            });

            // change the page
            changePage("#subPageRoom");

            // reset the board
            resetMultiplayerBoard();
        });
    });
});

/**
 * Function that runs if the opponent leaves the game you are in
 * 
 * @param   {boolean}   data    confirmation that the player has left
 */
socket.on("playerLeftResponse", function (data) {

    // validation check
    if (data) {

        // hide loader
        showWaiting(false);

        // change page back
        changePage("#subPageRoom");

        // decrement the incomplete games for player
        decrementIncompleteGames();

        // reset the board
        resetMultiplayerBoard();

        // show a message to the user
        showMessageTimeout("Your opponent has left the game! Taking you back to the menu", 3000);
    }
});

/******************************
 * 
 *     CREATING / JOINING
 * 
******************************/

/**
 * Function that creates a room for the user
 */
function createRoom() {

    // show the modal to select the board size
    $(createGameCont).fadeIn(500);

    // add a click handler to the confirmation button
    $(createRoomButtonConf).unbind("click").one("click", function () {

        // show a loader
        showWaiting("Creating a game, please wait...");

        // set up the user's statistics
        var completionRate = ((parseInt(userStats.gamesPlayed) / (parseInt(userStats.gamesPlayed) + parseInt(userStats.incompleteGames)))*100).toFixed(2);

        // just in case it is the user's first time, set their completion to 100%
        if (userStats.gamesPlayed == 0) {
            completionRate = 100;
        }

        // get the size from the checkbox
        var size = $("[name=size]:checked").val();
        var sizeInt = convertBoardSizeStrToInt(size);

        // set the board size
        boardSize = sizeInt;
        boardSizeStr = size;

        // construct the dto
        data = {
            "name": session.id,
            "boardSize": sizeInt,
            "highScore": userStats.highScore,
            "completionRate": completionRate
        };

        // tell the socket to create a game and pass the dto
        socket.emit("createGame", data);

        // hide the board size modal
        $(createGameCont).fadeOut(500);
    });

    // add a handler to the cancel button so that the user can back out of creating a game
    $(createRoomButtonCancel).off("click").one("click", function() {

        // fade the modal out
        $(createGameCont).fadeOut(500);

        // re-add handler to the create room button
        $(createRoomButton).off("click").one("click", function () {
            createRoom();
        });
    });
}

/**
 * Function to join another player's game
 * 
 * @param   {int}   id      the id of the game to join
 * @param   {int}   size    the size of the board that you are playing against
 */
function joinGame(id, size) {

    // user is obviously not the host
    host = false;

    // set the board size
    boardSize = size;
    boardSizeStr = convertBoardSizeIntToStr(size);

    // remove click handler to all other games
    $(".joinGame").off("click");

    // join the game
    socket.emit("joinGame", id);

    // show the loader while it connects to the game
    showWaiting(true, "Connecting you to the game, good luck!");
}

/**
 * Function to initialise the game
 */
function initGame() {

    // reset the board to create a correctly sized board
    resetMultiplayerBoard();

    // increment the incomplete games in case the player quits
    incrementIncompleteGames();

    // reset the ships to place
    shipsToPlace = new Array();

    // populate the user's ships, and ships remaining
    populateShips();

    // allow the user to place a ship
    initPlaceShips();

    // reset game class and boards
    game = new Game(boardSize);
    playerBoardClass = game.getPlayerBoard();
    opponentBoardClass = game.getComputerBoard();
}

/******************************
 * 
 *      POPULATING SHIPS
 * 
******************************/

/**
 * Function to populate the ships that can be placed into an array and into the reamining ships container in the HTML
 */
function populateShips() {

    // set the HTML to an empty string
    var remainingShipsHtml = "";

    // iterate through the ships
    for (i = 0; i < shipDetails.length; i++) {

        // add a ship class to the ships to place
        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        // construct the HTML
        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'></li>";
    }
    
    // publish the HTML
    $(page + " .boardExtrasContainer ul.remainingShips").html(remainingShipsHtml);
}

/**
 * Function to be run once all ships have been placed
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
        $(resetBoardButton).fadeOut(500).unbind("click");
        $(undoLastShipButton).fadeOut(500).unbind("click");

        // emit to server that player is ready
        showWaiting(true, "You're ready to play!<br/><br/>Please wait for your opponent to place their ships");

        // get the ships
        var myShipObjs = playerBoardClass.getShipsPlaced();
        var myShips = new Array();

        // convert the ship class to JSON
        for (var i = 0; i < myShipObjs.length; i++) {

            myShips.push(myShipObjs[i].toObject());
        }

        // emit to the correct listener depending on whether they are the host or not
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

/**
 * Function to run the player move
 */
function playerMove() {

    // bind a mouse event to the opponent's board
    $(page + " " + opponentBoard + " td").bind("mouseenter", function () {

        // put the individual cell to a variable
        var $cell = $(this);

        // check whether the cell can be fired on
        var canFire = boardFireHover($cell);

        // if the player can fire on that cell...
        if (canFire) {

            // remove all click events and add a fresh one
            $cell.unbind("click").one("click", function () {

                // on click, fire at the other player
                fireAtPlayer($cell);
            });
        } else {

            // cleanup any hovers on the page
            cleanupHoverClasses();
            removeClicks();
        }

        // bind a mouse leave event
        $cell.bind("mouseleave", function () {

            // cleanup any hovers / click handlers
            cleanupHoverClasses();
            removeClicks();
        });
    });
}

/**
 * Function to fire at the player
 * 
 * @param   {HTMLElement}   $cell   td object to fire at
 */
function fireAtPlayer($cell) {

    // if the cell is valid
    if ($cell) {

        // remove hover and click events and classes
        removeHovers();
        removeClicks();
        cleanupHoverClasses();

        // get the x and y values
        var x = $cell.index();
        var $tr = $cell.closest('tr');
        var y = $tr.index();

        // increment the total shots taken
        totalShots++;

        // fire off the event to the socket
        socket.emit("fire", {
            x: x,
            y: y
        });

        // show the loader
        showWaiting(true, "Firing at opponent's board!", 0.4);
    }
}

/**
 * Function to fire at the player's own board, used when the opponent fires
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 * 
 * @returns {object}    coordinate JSON object
 */
function boardFireAtSelf(x, y) {

    // see whether the opponent has hit a ship
    var hit = playerBoardClass.fire(x, y);

    // if the opponent hits
    if (hit) {

        // increment the hits received for stats
        totalHitsReceived++;
    }
    
    // get the coordinate object
    var coord = playerBoardClass.getCoordinateAt(x, y);

    // convert to JSON
    var coordinate = coord.toObject();

    // add the hit class to the board
    $(page + " " + playerBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

    // get the ship object from coordinate (may be null)
    var ship = coord.getShip(x, y);

    // if there is a ship
    if (ship) {

        // and if the ship is destroyed
        if (ship.isDestroyed()) {

            // change the remaining ships to show the destroyed ship
            $("#playerContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
        }
    }

    // return the JSON coordinate
    return coordinate;
}

/**
 * Function to run the fire function against the opponent
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function boardFireAtOpponent(x, y) {

    // find out whether the shot has hit
    var hit = opponentBoardClass.fire(x, y);

    // add the hit class to the relevant cell
    $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

    // if the cell was hit
    if (hit) {

        // increment for stats
        totalHits++;

        // add class for contains ship
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("containsShip");

        // get the coordinate object
        var coordObj = opponentBoardClass.getCoordinateAt(x, y);

        // get the ship object
        var ship = coordObj.getShip();

        // only populated if destroyed
        if (ship) {
            
            // validation check
            if (ship.isDestroyed()) {

                // set ship attribute on board
                setShipAttributesOnBoard(opponentBoard, ship);

                // update ships remaining
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
 * Function to update the perk HTML
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
 * 
 * @param   {string}    perk    the perk to be used
 */
function runPlayerPerk(perk) {

    // disable so player can't try and run another one
    disablePerks();

    // switch perk and run appropriate function
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
 * Function when ending the player's perk
 * 
 * @param   {boolean}   skipTurn    whether the perk counts as a turn
 * @param   {string}    perk        the perk that has ended
 */
function endPlayerPerk(skipTurn, perk) {

    // update the player's perk
    var x = game.updatePlayerPerks(perk);

    // update the HTML
    updatePerks();

    // if the perk counts as a turn
    if (skipTurn) {

        // run a fake move
        socket.emit("fire", "skip");

        // show loader
        showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!", 0.4);
    } else {
        
        // let the player have another move
        playerMove();
    }
}

/******************************
 * 
 *        PERK ACTIONS
 * 
******************************/

/**
 * Function to send the appropriate dto for the sonar perk to the opponent
 * i.e. player wants to use sonar on opponent's board at (x,y)
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function sonarAction(x, y) {

    // construct dto
    var data = {
        perk: "Sonar",
        x: x,
        y: y
    };

    // emit to the the socket
    socket.emit("usePerk", data);
}

/**
 * Function to run the sonar perk to send back to the opponent
 * i.e. opponent wants to use sonar on player's board at (x,y)
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function runSonarPerk(x, y) {

    // put sonar class to the 
    var sonar = new Sonar(playerBoardClass);

    // run the sonar action
    var cell = sonar.action(x, y);

    // construct the dto
    var data = {
        perk: "Sonar",
        x: cell ? cell.getX() : null,
        y: cell ? cell.getY() : null 
    };

    // if a cell has been found
    if (cell) {

        // mark it on the player's board
        $(page + " " + playerBoard + " tr:eq(" + cell.getY() + ") > td:eq(" + cell.getX() + ")").addClass("sonarShipLocation");
    }

    // emit the dto to the socket
    socket.emit("runPerkResponse", data);
}
 
/**
 * Function that runs the response from the opponent for sonar to show on the board
 * i.e. player has used sonar perk on opponent's board at (x,y) and wants to know if it found anything
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function responseSonarPerk(x, y) {

    // validation check
    if (x != null && y != null) {

        // add the class to the cell
        $(page + " " + opponentBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("sonarShipLocation");
    } else {

        // if no location found, alert user
        showMessageTimeout("No moves found! Better luck next time...", 3000);
    }

    // end the perk
    endPlayerPerk(true, "Sonar");
}

/**
 * Function to send the appropriate dto for the bounce bomb perk to the opponent
 * i.e. player wants to use bounce bomb on opponent's board at (x,y)
 * 
 * @param   {int}   x           the x value
 * @param   {int}   y           the y value
 * @param   {int}   orientation the orientation of the bounce bomb
 */
function bounceBombAction(x, y, orientation) {

    // construct dto
    var data = {
        perk: "Bounce_Bomb",
        x: x,
        y: y,
        orientation: orientation
    };

    // emit to socket
    socket.emit("usePerk", data);
}

/**
 * Function to run the bounce bomb perk to send back to the opponent
 * i.e. opponent wants to use bounce bomb on player's board at (x,y)
 * 
 * @param   {int}   x           the x value
 * @param   {int}   y           the y value
 * @param   {int}   orientation the orientation of the bounce bomb
 */
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

/**
 * Function that runs the response from the opponent for bounce bomb to show on the board
 * i.e. player has used bounce bomb perk on opponent's board at (x,y)
 * 
 * @param   {Object}    data    the object passed back from the player
 */
function responseBounceBombPerk(data) {

    // fire at the opponent of the first coordinate
    boardFireAtOpponent(data.x, data.y);

    // if the second coordinate is to be fired at
    if (data.num == 2) {

        // check the orientation and fire at it
        if (data.orientation == 1) {

            boardFireAtOpponent(data.x, data.y - 1);
        } else {

            boardFireAtOpponent(data.x + 1, data.y);
        }
    }

    // end the perk
    endPlayerPerk(true, "Bounce_Bomb");
}

/**
 * Function to send the appropriate dto for the mortar perk to the opponent
 * i.e. player wants to use mortar on opponent's board at (x,y)
 * 
 * @param   {int}   x   the x value
 * @param   {int}   y   the y value
 */
function mortarAction(x, y) {
    
    // construct the dto
    var data = {
        perk: "Mortar",
        x: x,
        y: y
    };

    // emit the dto to the socket
    socket.emit("usePerk", data);
}

/**
 * Function to run the mortar perk to send back to the opponent
 * i.e. opponent wants to use mortar on player's board at (x,y)
 * 
 * @param   {Object}    data    the data sent
 */
function runMortarPerk(data) {

    // put mortar class to variable
    var mortar = new Mortar(playerBoardClass);

    // get the cell objects from the action
    var cellObjs = mortar.action(data.x, data.y);

    // initialise an empty array
    var cells = new Array();

    // iterate through the cells from mortar action
    for (var i = 0; i < cellObjs.length; i++) {

        // add the JSON version of the object to the array
        cells.push(cellObjs[i].toObject());

        // fire at the player's own board for each cell
        boardFireAtSelf(cellObjs[i].getX(), cellObjs[i].getY());
    }

    // construct the dto
    var data = {
        perk: "Mortar",
        cells: cells
    };

    // emit the dto to the socket
    socket.emit("runPerkResponse", data);
}

/**
 * Function that runs the response from the opponent for mortar to show on the board
 * i.e. player has used mortar perk on opponent's board at (x,y)
 * 
 * @param   {Object}    data    the data sent
 */
function responseMortarPerk(data) {

    // get the cells to fire at
    var cells = data.cells;

    // iterate through
    for (var i = 0; i < cells.length; i++) {

        // fire at the opponent's board for each cell
        boardFireAtOpponent(cells[i].x, cells[i].y);
    }

    // end the perk
    endPlayerPerk(true, "Mortar");
}

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

/**
 * Function to show the opponent's ships that haven't been sunk yet
 */
function showRemainingShips() {

    // get the floating ships from the opponent's board
    var remainingShips = opponentBoardClass.getFloatingShips();

    // iterate through the ships
    for (var i = 0; i < remainingShips.length; i++) {

        // show the images
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

/**
 * Function to reset the board
 */
function resetMultiplayerBoard() {

    // change the board size
    $(".board").attr("data-size", boardSizeStr);

    // initialise the HTML
    var tableHtml = "<tbody>";

    // iterate through for the boardsize
    for (var i = 0; i < boardSize; i++) {

        // add the row
        tableHtml += "<tr>";

        // iterate through for the board size
        for (var x = 0; x < boardSize; x++) {

            // add the cell
            tableHtml += "<td><i class='hit'></i></td>";
        }

        // close the row
        tableHtml += "</tr>";
    }

    // close the table body
    tableHtml += "</tbody>";

    // publish the HTML
    $(".board").html(tableHtml);

    // hide the extras
    $(boardExtras).hide();

    // allow user to once again create a room
    $(createRoomButton).off("click").one("click", function () {

        createRoom();
    });
}

/**
 * Function to run the statistics queries
 * 
 * @param   {boolean}   won     whether the player has won or not
 */
function statisticsAjax(won) {

    // get the time and calculate the playing time
    var endTime = new Date();
    var playingTime = (endTime.getTime() - startTime.getTime()) / 1000;
    
    /*** SCORING ***/
    var boardSizeBonus = 0;

    // calculate the board size bonus
    switch (boardSize) {
        
        case 15:
            boardSizeBonus = 100;
            break;

        case 20:
            boardSizeBonus = 200;
            break;
    }

    // defaults
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

    // calculate stats
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

    // show the socre to the user
    showScore(gameScore, totalHitRScore, shotsMissedScore, totalHitScore, timeBonus, winBonus, boardSizeBonus);

    // fire off the ajax
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

    // remove any messages to the user on unload
    window.onbeforeunload = null;
}

/**
 * Function to increment the number of incomplete games for the player in the database
 */
function incrementIncompleteGames() {

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "incrementIncompleteGames"
        },
        type: "post"
    });
}

/**
 * Function to decrement the number of incomplete games for the player in the database
 */
function decrementIncompleteGames() {

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "decrementIncompleteGames"
        },
        type: "post"
    });
}

/**
 * Function to call if the user wins the game
 */
function winAjax() {

    // fire off ajax
    $.ajax({
        url: "../../Content/Ajax/multiplayerAjax.php",
        data: {
            action: "recordWin"
        },
        type: "post"
    });
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
 * @param   {float}     boardSizeBonus          bonus for the board size
 */
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