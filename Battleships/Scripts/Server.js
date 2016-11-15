/**
 * Last Modified By: Team
 * 
 * V0.1     Team            07/11/16    initial creation  
 * V0.2     Team            09/11/16    updates and bug fixes
 * V0.21    Nick            12/11/16    added joinGameResponse
 * V0.3     Dave            14/11/16    added methods to check that both clients are ready to play.
 * V0.31    Nick            14/11/16    recordHitResponse goes to opponent instead of user
 * V0.32    Nick            15/11/16    made sure opponent gets a game ready notification
 * V0.33    Nick / Dave     15/11/16    tweaks to leave game functionality to hopefully reduce errors
 * 
 */

/** Game class */
function Game(name, id, owner) {  
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.players = [];
  this.status = "available";
  this.hostReady = false;
  this.playerReady = false;
};

Game.prototype.addPlayer = function(userID) {  
  if (this.status === "available") {
    this.players.push(userID);
  }
};

/***********************************************
SERVER SETUP FOR LOCALHOST/HTTP
************************************************/
/*var express = require('express');
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

server.listen(3000);*/
/*************************************************
END OF SERVER SETUP FOR LOCALHOST/HTTP
*************************************************/


/***********************************************
SERVER SSL/HTTPS SETUP FOR PREPRODUCTION/PRODUCTION
************************************************/
var https = require('https'), 
	path = require('path'),
    fs = require('fs'),
	express = require('express'),
	app = express();        

var options = 
	{
		pfx: fs.readFileSync('./battleships-preprod.pfx'),
		passphrase: 'password',
		requestCert: false,
		rejectUnauthorized: false
	};
var server = https.createServer(options, app);
var io = require('socket.io').listen(server);     //socket.io server listens to https connections

server.listen(3000);
/*************************************************
END OF SERVER SSL/HTTPS SETUP FOR PREPRODUCTION/PRODUCTION
*************************************************/

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
        socket.emit('joinServerRepsonse', true);
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
            socket.emit("joinGameResponse", false);
        } 
        else if (players[socket.id].game != null){
            socket.emit("alert", "You are already in a game");
            socket.emit("joinGameResponse", false);
        }
        else if (game.players.length >= 2){
            socket.emit("alert", "This game is full, please create a new one");
            socket.emit("joinGameResponse", false);
        }
        else {
            game.addPlayer(socket.id); //add the player to the game object
            players[socket.id].game = id; //update the game id in the player object
            socket.game = game.name;
            socket.join(socket.game); //add player to the game room
            user = players[socket.id];
            io.sockets.in(socket.game).emit("alert", user.username + " has connected to " + game.name);// Message to players in the game
            socket.emit("alert", "Welcome to " + game.name + ".");
            io.sockets.in(socket.game).emit("joinGameResponse", true);

            var opponent = getOpponent();
            io.sockets.to(opponent).emit("opponentName", players[socket.id].username);//Joinee
            socket.emit("opponentName", players[opponent].username);//Host
        }
    });

    /**
     * Sets the host to ready and starts the game
     */
    socket.on("hostReady", function(){
        var game = games[players[socket.id].game];
        game.hostReady = true;
        console.log("Host is ready. . .");

        if (game.hostReady && game.playerReady) {
            var playerToStart = chooseStartingPlayer(game);
            socket.emit("gameReady", playerToStart);
            io.sockets.to(getOpponent()).emit("gameReady");

            io.sockets.to(playerToStart).emit("playerToStart", true);
        }
    });

    /**
     * Sets the player to ready
     */
    socket.on("playerReady", function(){
        console.log("player is ready. . .")
        var game = games[players[socket.id].game];
        game.playerReady = true;

        if (game.hostReady && game.playerReady) {
            var playerToStart = chooseStartingPlayer(game);
            socket.emit("gameReady", playerToStart);
            io.sockets.to(getOpponent()).emit("gameReady");

            io.sockets.to(playerToStart).emit("playerToStart", true);
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
            io.sockets.to(socket.id).emit('leaveGameResponse', true);
            var opponent = getOpponent();
            io.sockets.to(opponent).emit('playerLeftResponse', true); 
            leaveGame();
        }
    });

    /**
     * Records the win/loss and ends the game.
     */
    socket.on("lostGame", function(){
        if(players[socket.id].game !== null){
            var opponent = getOpponent();
            io.sockets.to(socket.id).emit("lostGameResponse", true);//Loss
            io.sockets.to(opponent).emit("lostGameRepsonse", false);//Win
            leaveGame(); //end the game
        }
    });

    /**
     * Tells the opponent to record a hit at x,y
     */
    socket.on("fire", function(coord) {
        var opponent = getOpponent();
        io.sockets.to(opponent).emit("recordHit", coord);
    });

    /**
     * Waits for response from oppenent of a recorded hit, transmits the data back to the client (hit/miss)
     */
    socket.on("recordHitResponse", function (data) {
        var opponent = getOpponent();
        io.sockets.to(opponent).emit("fireResponse", data);
    });
    
    /**
     * Removes players from game gracefully on disconnect 
     */
    socket.on("disconnect", function() {  
        if (players[socket.id]) {

            var player = players[socket.id];

            if (player == null) {

            } else if (player.game == null) {
                delete players[socket.id];
            } else {
                io.sockets.to(getOpponent()).emit('playerLeftResponse', true); 
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
            if (clients[i].id == game.players[0]) {
                clients[i].leave(game.name);
            } else if (clients[i].id == game.players[1]) {
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
        //Delete the game session
        delete games[gameId]; 

        // refresh games list
        io.sockets.emit("gameList", games);
    }

    function getOpponent(){
        var opponent;
        var game = games[players[socket.id].game];
        if(game.players[0] !== socket.id){
            opponent = game.players[0];
        } else{
            opponent = game.players[1];
        }
        return opponent;
    }

    /**
     * Returns at random, who will start the game.
     */
    function chooseStartingPlayer(game){
        var game = games[players[socket.id].game];
        var player = Math.round((Math.random()));
        return game.players[player];
    }
});
