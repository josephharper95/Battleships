/**
 * Last Modified By: Team
 * 
 * 0.1  Team    07/11/16    initial creation  
 * 0.2  Team    09/11/16    updates and bug fixes
 */

/** Game class */
function Game(name, id, owner) {  
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.players = [];
  this.status = "available";
};

Game.prototype.addPlayer = function(userID) {  
  if (this.status === "available") {
    this.players.push(userID);
  }
};

/** Server Code */

var express = require('express');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    path = require('path');

console.log('Server running. . . ');

// Loading the page index.html
// app.get('/', function (req, res) {
//     console.log(req.socket.address());
//     res.sendFile(path.join(__dirname, '../Content/Pages', 'startMultiplayer.php'));
// });

// //app.use(express.static('Classes'));

//Create objects for players and games
var players = {};
var games ={};
//Store array of connected clients
var clients = [];
//id for new games
var id = 0;

// socket.emit = YOUR client
// io.sockets.emit = ALL clients

io.sockets.on('connection', function (socket, username) {

    /**
     * Executes when a new client joins the server. 
     */
    socket.on('join', function(username) {

        var gameID = null;

        players[socket.id] = {
            "username": username, 
            "game": gameID
        };

        socket.emit("alert", "You have connected to the server.");
        io.sockets.emit("alert", players[socket.id].username + " is online.");
        socket.emit("gameList", games);

        clients.push(socket); //populate the clients array with the client object

        io.sockets.emit("playersOnline", clients.length);
    });

    /**
     * Creates a new game room and assigns the calling client as the owner. The owner is added to the game.
     */
    socket.on("createGame", function(name) {

        if (players[socket.id] == null) {

            io.sockets.emit("alert", "players[socket.id] == null");
        } else {

            //If the player is not in a game
            if (players[socket.id].game == null) {

                var game = new Game(name, id, socket.id);

                games[id] = game;

                io.sockets.emit("gameList", games); //update the list of games on the frontend

                socket.game = name;

                socket.join(socket.game); //Creator is added to the game

                game.addPlayer(socket.id); //also add the player to the game object

                players[socket.id].game = id; //Add the game id to the player object

                id++; //Increment the ID for the next game session to use

                socket.emit("createGameResponse", true)

            } else {
                //io.sockets.emit("alert", "You are already in a game.");
                socket.emit("createGameResponse", false);
            }
        }
    });

    /**
     * Adds the client to the game with the given id.
     */
    socket.on("joinGame", function(id) {  

        var game = games[id];//get the game that corresponds with the id

        //Perform some validation
        if (socket.id == game.owner) {
            socket.emit("alert", "You are the owner of this game and you have already been joined.");
        } 
        else if (players[socket.id].game != null){
            socket.emit("alert", "You are already in a game");
        }
        else if (game.players.length >= 2){
            socket.emit("alert", "This game is full, please create a new one");
        }
        else {
            game.addPlayer(socket.id); //add the player to the game object
            players[socket.id].game = id; //update the game id in the player object
            socket.game = game.name;
            socket.join(socket.game); //add player to the game room
            user = players[socket.id];
            io.sockets.in(socket.game).emit("alert", user.username + " has connected to " + game.name);// Message to players in the game
            socket.emit("alert", "Welcome to " + game.name + ".");
            }
    });

    /**
     * Sends a message to players in the same game.
     */
    socket.on("message", function(message) {  
        if (players[socket.id].game !== null) {
            //TODO: Maybe store the game object in a variable so it doesn't have to be called this way??
            io.sockets.in(games[players[socket.id].game].name).emit("chat", {username: players[socket.id].username, message: message});
        } else {
            socket.emit("alert", "Please connect to a game.");//Must be in a game to send a message
        }
    });

    /**
     * Removes all clients from the game and closes that game session.
     */
    socket.on("leaveGame", function() {

        if (players[socket.id] == null) {
            console.log("players[socket.id] == null");
        } else if (games[players[socket.id].game] == null) {
            console.log("games[player[socket.id]] == null");
        } else {
            leaveGame();
        }
    });

    socket.on("fire", function(coord){
        var opponent;
        var game = games[players[socket.id].game];
            if(game.players[0] !== socket.id){
                opponent = game.players[0];
            }else{
                opponent = game.players[1];
            }
        io.sockets.to(opponent).emit("recordHit", coord);
    });

    socket.on("sonarRequest", function(x,y){
        
    });



    /**
     * Removes players from game gracefully on disconnect
     * TODO: Code is copied from leave game, not worked out how to call the other method internally. 
     */
    socket.on("disconnect", function() {  
        if (players[socket.id]) {

            var player = players[socket.id];

            if (player == null) {

            } else if (player.game == null) {
                delete players[socket.id];
            } else {
                leaveGame();
                delete players[socket.id];
            }

            var username = player.username;

            //Remove the client from the client array.
            io.sockets.emit("alert", username + " has gone offline.");
            var index = clients.indexOf(socket);
            clients.splice(index, 1);

            console.log("Players Online: " + clients.length);

            io.sockets.emit("playersOnline", clients.length);
        }
    });

    function leaveGame() {

        //Get the game object that the player is in
        var game = games[players[socket.id].game];

        // alerting to all relevant that A player has left the game
        io.sockets.in(socket.game).emit("alert", "(" +players[socket.id].username + ") is leaving the game. The game has ended.");
        
        //Store the game ID
        var gameId = players[socket.id].game 

        //Iterate over connected clients, if that client is in this game remove them TODO: Can this be more efficient?
        for (var i=0; i < clients.length; i++){
            if (clients[i].id == game.players[i]) {
                clients[i].leave(game.name);
            }
        }

        var game = games[players[socket.id].game];
        if (game.players[0] == socket.id) {
            var opponent = game.players[1];
            
            if (opponent != null) {
                players[opponent].game = null;
            }
        }

        players[socket.id].game = null;

        //if (game[gameId]) {
            //Delete the game session
            delete games[gameId]; 
        //}

        // refresh games list
        io.sockets.emit("gameList", games);
    }
});

server.listen(3000);
// server.listen(process.env.port, function () {  //Updated
//   var addr = server.address();
//   console.log('   app listening on http://' + addr.address + ':' + addr.port);
// });