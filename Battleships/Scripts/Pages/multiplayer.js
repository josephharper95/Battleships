/**
 * Last Modified By: Dave MacDonald
 * 
 * V0.1     Nick        08/11/16    initial creation
 * V0.2     Nick        09/11/16    added the ability to create / leave room
 * V0.2.1   Dave        09/11/16    Create game bug fix
 * V0.3     Team        09/11/16    added more listeners and giving more feedback to user
 * V0.31    Nick        10/11/16    added in loader until the user connects to the server
 * V0.4     Nick        12/11/16    added timeout to join server, added the ability to join a game
 * V0.5     Nick        13/11/16    added necessary variables to be able to place ships - place ship functionality
 * V0.6     Nick        14/11/16    players can now fire at each other
 * V0.61    Nick        15/11/16    bug fixes
 * V0.7     Nick        15/11/16    ships now show when you sink them on the opponen'ts board. enemy firing now shows on your board
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
socket.on('alert', function(message){
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

    if (data) {

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
        
        initGame();

    } else {

        alert("Couldn't join you to the game :(");
    }
});

function initGame() {

    if (shipsToPlace.length == 0) {
        populateShips();
        initPlaceShips();
    }

    game = new Game(boardSize);
    playerBoardClass = game.getPlayerBoard();
    opponentBoardClass = game.getComputerBoard();

}

socket.on("gameReady", function (data) {

    console.log("gameReady");
    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!");
});

socket.on("playerToStart", function(data) {

    console.log("playerToStart");
    showWaiting(false);
    
    if (data) {
         console.log("You are going first!!!");
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
    console.log("populating ships");
    var remainingShipsHtml = "";

    for (i = 0; i < shipDetails.length; i++) {

        shipsToPlace.push(new Ship(shipDetails[i].name, shipDetails[i].size));

        remainingShipsHtml += "<li class='" + shipDetails[i].name + "'>" + shipDetails[i].name + "</li>";
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

        console.log("Host: " + host);

        if(host){
            socket.emit("hostReady");
        } else{
            socket.emit("playerReady");
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
        }

        $cell.bind("mouseleave", function () {
            cleanupHoverClasses();
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

        showWaiting(true, "Firing at opponent's board!")
    }
}

socket.on("recordHit", function (data) {
    
    if (data) {

        var x = data.x;
        var y = data.y;

        var hit = playerBoardClass.fire(x, y);
        var ship = null;
        var coord = playerBoardClass.getCoordinateAt(x, y);
        var coordinate = coord.toObject();

        $(page + " " + playerBoard + " tr:eq(" + y + ") > td:eq(" + x + ")").addClass("hit");

        if (hit) {
            var shipObj = coord.getShip();

            if (shipObj && shipObj.isDestroyed()) {
                ship = shipObj.toObject();

                setShipAttributesOnBoard(playerBoard, shipObj);

                console.log(ship);
            }
        }

        socket.emit("recordHitResponse", {
            coordinate: coordinate,
            hit: hit,
            ship: ship
        });

        showWaiting(false);
        playerMove();
    }
});

socket.on("fireResponse", function (data) {
    showWaiting(false);

    var coord = data.coordinate;
    var hit = data.hit;
    var ship = data.ship;

    console.log(data);

    $(page + " " + opponentBoard + " tr:eq(" + coord.y + ") > td:eq(" + coord.x + ")").addClass("hit");

    if (hit) {
        $(page + " " + opponentBoard + " tr:eq(" + coord.y + ") > td:eq(" + coord.x + ")").addClass("containsShip");

        // only populated if destroyed
        if (ship) {
            
            // set up ship object
            var shipObj = new Ship(ship.name, ship.size);

            // change orientation if necessary
            if (ship.orientation != 1) {
                shipObj.changeOrientation();
            }

            var shipCoords = data.ship.coordinates;

            // place the ship on the board
            opponentBoardClass.placeShip(shipObj, shipCoords[0].x, shipCoords[0].y);

            // fire  at all coords
            for (i = 0; i < shipCoords.length; i++) {

                var c = shipCoords[i];
                opponentBoardClass.fire(c.x, c.y);
            }

            setShipAttributesOnBoard(opponentBoard, shipObj);
        }
    }

    showWaiting(true, "Your opponent is making their move.<br/><br/>Get ready to make yours!");
});