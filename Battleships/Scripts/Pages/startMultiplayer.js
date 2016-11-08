/**
 * 
 */

// Connecting to socket.io
var socket = io.connect('http://localhost:3000');

var availableRooms = "#availableRooms";

$(document).ready(function() {

    socket.emit("join", session.id);

    fakeCreatingGame();

});

// FAKES
function fakeCreatingGame() {
    socket.emit("createGame", "nholdswo");
}

socket.on('gameList', function (data) {

    console.log("Games");

    var returnText = "";
    
    for (var game in data) {

        if (data.hasOwnProperty(game)) {

            if (data[game].players.length != 2) {
                
                returnText += "<li>";

                console.log(game + " -> " + data[game].name);

                returnText += data[game].name;

                returnText += "</li>";
            }
            
        }
    }

    $(availableRooms).html(returnText);
});