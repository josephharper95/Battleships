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

/**************************************** */
//Getting the oppenent name and the player to start

socket.on("opponentName", function(data){
    console.log("Opponent: " + data);
});

socket.on("gameReady", function(data){
    console.log("Player to start: " +data);
});

socket.on("playerToStart", function(data){
    if(data){
         console.log("You are going first!!!");
    }
});

/**************************************** */

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

        /************************************************************** */
        if(host){
            socket.emit("hostReady");
        } else{
            socket.emit("playerReady");
        }
        /************************************************************** */
    });
}