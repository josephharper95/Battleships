/**
 * Last Modified By: Dave MacDonald
 * 
 * V0.1     Nick        08/11/16    initial creation
 * V0.2     Nick        09/11/16    added the ability to create / leave room
 * V0.2.1   Dave        09/11/16    Create game bug fix
 * V0.3     Team        09/11/16    added more listeners and giving more feedback to user
 * V0.31    Nick        10/11/16    added in loader until the user connects to the server
 * V0.4     Nick        12/11/16    added timeout to join server, added the ability to join a game
 * 
 */

// Connecting to socket.io
//var socket = io.connect('http://40.68.102.207:3000');
var socket = io.connect('https://battleships-preprod.tk:3000', {secure: true});
//var socket = io.connect('http://localhost:3000'); // UNCOMMENT FOR LOCALHOST DEV

var createRoomButton = "#createGame";
var cancelGameButton = "#cancelGame";

var availableRooms = "#availableRooms";

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
        }
    });

    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });

});

socket.on("playersOnline", function (num) {
    $("#playersOnline").html("Online (" + num + " Worldwide)");
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

        alert("Game is now ready to play!");

    } else {

        alert("Couldn't join you to the game :(");
    }
});

socket.on("gameReady", function (ready) {
    if (ready) {
        showWaiting(false);
        alert("Lobby ready");
    }
});