/**
 * Last Modified By: Dave MacDonald
 * 
 * V0.1     Nick        08/11/16    initial creation
 * V0.2     Nick        09/11/16    added the ability to create / leave room
 * V0.2.1   Dave        09/11/16    Create game bug fix
 * 
 */

// Connecting to socket.io
var socket = io.connect('http://40.68.102.207:3000');
//var socket = io.connect('http://localhost:3000');

var createRoomButton = "#createGame";
var cancelGameButton = "#cancelGame";

var availableRooms = "#availableRooms";

$(document).ready(function() {

    socket.emit("join", session.id);

    $(createRoomButton).off("click").one("click", function () {
        createRoom();
    });

});

//To show alerts from server
socket.on('alert', function(message){
    console.log(message);
});

socket.on('gameList', function (data) {

    console.log("Games");

    var returnText = "";
    
    for (var game in data) {

        if (data.hasOwnProperty(game)) {

            if (data[game].players.length != 2) {
                
                returnText += "<li>";

                console.log(game + " -> " + data[game].name);

                returnText += "<span>";
                returnText += data[game].name;
                returnText += "</span>";

                returnText += "<button ";
                returnText += "class='joinGame' "
                returnText += "data-username='" + data[game].name + "'"; 
                returnText += ">"

                returnText += "Join Game"

                returnText += "</button>";

                returnText += "</li>";
            }
            
        }
    }

    $(availableRooms).html(returnText);
});

function createRoom() {

    socket.emit("createGame", session.id);

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
}