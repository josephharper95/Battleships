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
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

// Loading the page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use(express.static('Classes'));

//Create objects for players and games
var players = {};
var games ={};
//Store array of connected clients
var clients = [];
//id for new games
var id = 0;

io.sockets.on('connection', function (socket, username) {

    /**
     * Executes when a new client joins the server. 
     */
    socket.on('join', function(username){
        var gameID = null;
        players[socket.id] = {"username": username, "game": gameID};
        socket.emit("alert", "You have connected to the server.");
        io.sockets.emit("alert", players[socket.id].username + " is online.")
        socket.emit("gameList", games);
        clients.push(socket); //populate the clients array with the client object
    });

    /**
     * Creates a new game room and assigns the calling client as the owner. The owner is added to the game.
     */
    socket.on("createGame", function(name) {  
        //If the player is not in a game
        if (players[socket.id].game === null) {
            var game = new Game(name, id, socket.id);
            games[id] = game;
            io.sockets.emit("gameList", games); //update the list of games on the frontend
            socket.game = name;
            socket.join(socket.game); //Creator is added to the game
            game.addPlayer(socket.id); //also add the player to the game object
            players[socket.id].game = id; //Add the game id to the player object
            id++; //Increment the ID for the next game session to use
        } else {
            io.sockets.emit("alert", "You are already in a game.");
        }
    });

    /**
     * Adds the client to the game with the given id.
     */
    socket.on("joinGame", function(id) {  
        var game = games[id];//get the game that corresponds with the id
        //Perform some validation
        if (socket.id === game.owner) {
        socket.emit("alert", "You are the owner of this game and you have already been joined.");
        } 
        else if(players[socket.id].game !== null){
            socket.emit("alert", "You are already in a game");
        }
        else if(game.players.length >= 2){
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
         * Removes the client from the game. If the host leaves the game, the game session is deleted.
         */
        socket.on("leaveGame", function() {  
        var game = games[players[socket.id].game];//Get the game object that the player is in
        if (socket.id === game.owner) {//If this player is the owner of the game
            io.sockets.in(socket.game).emit("alert", "The host (" +players[socket.id].username + ") is leaving the game. The game has ended.");
            delete games[players[socket.id].game]; //Delete the game session
            var i = 0;
            //Remove all players from the game
            while(i < clients.length) {
                if(clients[i].id == game.players[i]) {
                    players[clients[i].id].game = null;
                    clients[i].leave(game.name);
                }
            i++;
            }
            players[socket.id].game = null; //TODO: Maybe not needed?
            io.sockets.emit("gameList", games); //Refresh the games list
            
        } else {
                var index = game.players.indexOf(socket.id);
                game.players.splice(index, 1); //Remove the player from the game players array
                players[socket.id].game = null; //Remove game reference from the player object
                io.sockets.emit("alert", players[socket.id].username + " has left the game.");
                socket.leave(game.name); //Remove the player from the game session
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
            var username = players[socket.id].username;
            if (players[socket.id].game === null) { //If the player is not in a game
                delete players[socket.id]; // Remove the player from the player list.
            } else {
                //Copied section from leave game
                if (players[socket.id].game !== null) {
                    var game = games[players[socket.id].game];
                    if (socket.id === game.owner) {
                        io.sockets.in(socket.game).emit("alert", "The host (" +players[socket.id].username + ") is leaving the game. The game has ended.");
                        delete games[players[socket.id].game];
                        var i = 0;
                        //Remove all players from the game
                        while(i < clients.length) {
                            if(clients[i].id == game.players[i]) {
                                players[clients[i].id].game = null;
                                clients[i].leave(game.name);
                            }
                        i++;
                    }
                }
                var index = game.players.indexOf(socket.id);
                game.players.splice(index, 1); //Remove the player from the game players array
                socket.game = undefined;
                delete players[socket.id];
                io.sockets.emit("gameList", games);
                }
            }
        }
        //Remove the client from the client array.
        io.sockets.emit("alert", username + " has gone offline.");
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
        console.log(clients.length);
    });
});



server.listen(3000);