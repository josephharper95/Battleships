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
 * 
 */

// Connecting to socket.io
//var socket = io.connect('http://40.68.102.207:3000');
var socket = io.connect('https://battleships-preprod.tk:3000', {secure: true});
//var socket = io.connect('http://localhost:3000'); // UNCOMMENT FOR LOCALHOST DEV

var game;
var host = false; //******* this is updated if they create a game ******
var playerBoardClass;
var opponentBoardClass;
var boardSize = 10; // static for the moment

var page = "#subPagePlayGame";
var playerBoard = "#playerBoard";
var opponentBoard = "#opponentBoard";

var createRoomButton = "#createGame";
var cancelGameButton = "#cancelGame";
var backToMultiplayerButton = "#backToMultiplayer";

var startGameButton = "#playerReady";
var rotateShipButton = "#rotateShip";
var undoLastShipButton = "#undoLastShip";
var resetBoardButton = "#resetBoard";

var availableRooms = "#availableRooms";

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

    var timeout = setTimeout(function () {
        socket.emit("join", session.id);
    }, 5000);

    socket.on("joinServerRepsonse", function(data) {
        if (data){
            showWaiting(false);
            clearTimeout(timeout);
        } else {
            showWaiting(false);

        }
    });

    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });

});

function changePage(page) {
    // $(".subPage").fadeOut(500, function () {
    //     $(page).fadeIn(500);
    // });

    $(".subPage:not(" + page +")").fadeOut(200).promise().done(function () {
        $(page).fadeIn(500);
    });
}

socket.on("playersOnline", function (num) {
    $("#playersOnline").html("Online (" + num + " Worldwide)");
});

socket.on("opponentName", function(data){
    //console.log("Opponent: " + data);
    $("#opponentName").html("Opponent: " + data);
});

//To show alerts from server
socket.on('alert', function(message){ // listens for alert emit from server.js
    console.log(message);
});

socket.on('gameList', function (data) {

    //console.log("Games");

    var returnText = "";
    
    for (var game in data) {

        if (data.hasOwnProperty(game)) {

            if (data[game].players.length != 2) {
                
                returnText += "<li>";

                //console.log(game + " -> " + data[game].name);

                returnText += "<span>";
                returnText += data[game].name;
                returnText += "</span>";

                if (data[game].name != session.id) {

                    // button markup
                    returnText += "<button ";
                    returnText += "class='joinGame' "
                    returnText += "data-game='" + data[game].id + "'"; 
                    returnText += ">"
                    returnText += "Join Game"
                    returnText += "</button>";
                }

                returnText += "</li>";
            }
        }
    }

    $(availableRooms).html(returnText);

    // click handlers for joining a game
    $(".joinGame").off("click").on("click", function () {
        
        var id = $(this).data("game");

        joinGame(id);
    });
});

function createRoom() {
    socket.emit("createGame", session.id);
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

        alert("FAILED TO CREATE GAME");

        $(createRoomButton).off("click").one("click", function () {
            createRoom();
        });
    }
});

function joinGame(id) {

    host = false;

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

        alert("Couldn't join you to the game :(");
    }
});

function initGame() {

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

    $(".boardExtrasContainer").fadeIn(500);

    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!");
});

socket.on("playerToStart", function(data) {

    //console.log("playerToStart");
    showWaiting(false);
    
    if (data) {
         //console.log("You are going first!!!");
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
    //console.log("populating ships");
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

    // show the start game button
    $(startGameButton).fadeIn(500);
    
    // add click handler to the button at this point
    $(startGameButton).unbind("click").one("click", function () {

        // on click - fade button out
        $(startGameButton).fadeOut(500);
        $(resetBoardButton).fadeOut(500).unbind("click");
        $(undoLastShipButton).fadeOut(500).unbind("click");

        // emit to server that player is ready
        showWaiting(true, "You're ready to play!<br/><br/>Please wait for your opponent to place their ships")

        //console.log("Host: " + host);

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

        socket.emit("fire", {
            x: x,
            y: y
        });

        showWaiting(true, "Firing at opponent's board!", 0.4);
    }
}

socket.on("recordHit", function (data) {
    
    if (data) {

        var x = data.x;
        var y = data.y;

        var hit = playerBoardClass.fire(x, y);
        
        var coord = playerBoardClass.getCoordinateAt(x, y);
        var coordinate = coord.toObject();

        $(page + " " + playerBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

        var ship = coord.getShip(x, y);

        if (ship) {
            if (ship.isDestroyed()) {
                $("#playerContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }

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

socket.on("fireResponse", function (data) {
    showWaiting(false);

    var coord = data.coordinate;

    // fire at board
    var hit = opponentBoardClass.fire(coord.x, coord.y);

    $(page + " " + opponentBoard + " tr:eq(" + coord.y + ") > td:eq(" + coord.x + ")").addClass("hit");

    if (hit) {

        $(page + " " + opponentBoard + " tr:eq(" + coord.y + ") > td:eq(" + coord.x + ")").addClass("containsShip");

        var coordObj = opponentBoardClass.getCoordinateAt(coord.x, coord.y);

        var ship = coordObj.getShip();

        // only populated if destroyed
        if (ship) {
            
            if (ship.isDestroyed()) {
                setShipAttributesOnBoard(opponentBoard, ship);

                $("#opponentContainer .boardExtrasContainer ul.remainingShips li." + ship.getName()).addClass("destroyed");
            }
        }
    }

    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!", 0.4);
});

/******************************
 * 
 *        GAME EVENTS
 * 
******************************/

socket.on("lostGameResponse", function (lost) {
    
    showWaiting(false);

    if (lost) {
        showRemainingShips();
        alert("You lost the game, get better.")
    } else {

        alert("You won! ...nothing");
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

        alert("Your opponent has only gone and bladdy left!");
    }
});

function showRemainingShips() {
    var remainingShips = opponentBoardClass.getFloatingShips();

    for (var i = 0; i < remainingShips.length; i++) {
        setShipAttributesOnBoard(opponentBoard, remainingShips[i]);
    }
}

function resetMultiplayerBoard() {

    var $cell = $(page + " " + playerBoard + " td, " + page + " " + opponentBoard + " td")
    
    $cell.removeClass("hit");
    $cell.removeClass("containsShip");

    $cell.removeAttr("data-ship");
    $cell.removeAttr("data-orientation");
    $cell.removeAttr("data-ship-part");

}