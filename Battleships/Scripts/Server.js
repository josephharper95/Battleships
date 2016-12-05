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
 * V0.34    Dave            15/11/16    Changed clients to be an associative array.
 * V0.35    Dave            16/11/16    Added playerLeftResponse to lostGame
 * V0.36    Nick            16/11/16    altered spelling mistake, checking for undefined AND null removed
 * V0.37    Nick            17/11/16    passing player's ships to the other player
 * V0.38    Dave            25/11/16    users cannot join on different sessions anymore.
 * V0.39    Dave            28/11/16    added methods required for sonar perk
 * V0.4     Dave            1/12/16     Added more info to the games class and returned gamesList
 * V0.41    Dave            2/12/16     Updated perk methods to be dynamic
 * V0.42    Nick            02/12/16    updated perk functionality
 * V0.43    Dave            05/12/16    fixed bug with gameList not being updated
 */

 /******************************
     * 
     *      GAME CLASS
     * 
 ******************************/ 
function Game(name, id, owner, boardSize, highScore, completionRate) {  
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.players = [];
  this.status = "available";
  this.hostReady = false;
  this.playerReady = false;
  this.hostHighScore = highScore;
  this.hostCompletionRate = completionRate;
  this.boardSize = boardSize;

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
SERVER SSL/HTTPS SETUP FOR PREPRODUCTION
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
END OF SERVER SSL/HTTPS SETUP FOR PREPRODUCTION
*************************************************/

/*********************************************** 
SERVER SSL/HTTPS SETUP FOR PRODUCTION 
************************************************/ 
/*var https = require('https'),
    path = require('path'),
    fs = require('fs'),
    express = require('express'),
    app = express();
                         
var options =
 	{
 		pfx: fs.readFileSync('./battleships-prod.pfx'),
        passphrase: 'password',
        requestCert: false,
        rejectUnauthorized: false
    };
var server = https.createServer(options, app); 
var io = require('socket.io').listen(server);     //socket.io server listens to https connections 

server.listen(3000); */
/************************************************* 
END OF SERVER SSL/HTTPS SETUP FOR PRODUCTION 
*************************************************/

console.log('Server running. . . ');

//Create objects for players, games and clients
var players = {};
var usernames = {};
var games ={};
var clients = {};
var numOfPlayersOnline = 0;
//id for new games
var id = 0;

// socket.emit = YOUR client
// io.sockets.emit = ALL clients

io.sockets.on('connection', function (socket, username) { //emited from multiplayer.js

     /******************************
     * 
     *      CLIENT JOIN / DISCONNECT
     * 
    ******************************/ 

    /**
     * Executes when a new client joins the server. 
     */
    socket.on('join', function(username) {

        var gameID = null;
        //Check the user is not already connected
        if(typeof(usernames[username]) !== 'undefined'){
            socket.emit("alert", "You are already connected on a different session.");
            socket.emit("joinServerRepsonse", false);
            return;
        }

        players[socket.id] = {   // New client object is added to the associative players array based on their ID (from socket)
            "username": username, 
            "game": gameID 
        };

        //Store the username for future connection checks.
        usernames[username] = {
            "loggedIn": true
        };
        // There is always an "on" (listener) for each emit
        socket.emit("alert", "You have connected to the server.");   // emitted to console (alert)
        io.sockets.emit("alert", players[socket.id].username + " is online.");
        socket.emit("gameList", games); //emits number of games available (passes games object)

        clients[socket.id] = { // Add socket information to clients array
            "socket": socket
        };

        numOfPlayersOnline ++;
        io.sockets.emit("playersOnline", numOfPlayersOnline);
        socket.emit('joinServerRepsonse', true);
    });

    /**
     * Removes players from game gracefully on disconnect 
     */
    socket.on("disconnect", function() {  
        if (players[socket.id]) { // If player exists

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
            delete usernames[player.username];
            //Remove the client from the client array.
            io.sockets.emit("alert", username + " has gone offline.");
            delete clients[socket.id];
            
            numOfPlayersOnline --;
            io.sockets.emit("playersOnline", numOfPlayersOnline);
        }
    });

     /******************************
     * 
     *   GAME ROOM HANDLING
     * 
     ******************************/ 

    /**
     * Creates a new game room and assigns the calling client as the owner. The owner is added to the game.
     */
    socket.on("createGame", function(data) {

        if(typeof(data)!=='object'){
            return false;
        }

        if (players[socket.id] == null) { //checks that player has been created

            io.sockets.emit("alert", "players[socket.id] == null");
        } else {

            //If the player is not in a game
            if (players[socket.id].game == null) {

                var game = new Game(data.name, id, socket.id, data.boardSize, data.highScore, data.completionRate);

                games[id] = game;

                io.sockets.emit("gameList", games); //update the list of games on the frontend

                socket.game = data.name;

                socket.join(socket.game); //Creator is added to the game

                game.addPlayer(socket.id); //also add the player to the game object

                players[socket.id].game = id; //Add the game id to the player object

                id++; //Increment the ID for the next game session to use

                socket.emit("createGameResponse", true);

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
            socket.game = game.name; //TODO: Look into removing variable
            socket.join(socket.game); //add player to the game room
            var user = players[socket.id]; 
            io.sockets.in(socket.game).emit("alert", user.username + " has connected to " + game.name);// Message to players in the game
            socket.emit("alert", "Welcome to " + game.name + ".");
            io.sockets.in(socket.game).emit("joinGameResponse", true);

            var opponent = getOpponent();
            io.sockets.to(opponent).emit("opponentName", players[socket.id].username);//Joinee
            io.sockets.emit("gameList", games);//Update available games
            socket.emit("opponentName", players[opponent].username);//Host
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

    /******************************
     * 
     *       STARTING GAME
     * 
     ******************************/ 

    /**
     * Sets the host to ready and starts the game
     */
    socket.on("hostReady", function(data) {

        var game = games[players[socket.id].game]; //Gets current game
        game.hostReady = true; // sets host as ready
        console.log("Host is ready. . ."); //logs in node server console

        game.hostShips = data;

        if (game.hostReady && game.playerReady) {
            var playerToStart = chooseStartingPlayer(game);
            socket.emit("gameReady", game.playerShips);
            io.sockets.to(getOpponent()).emit("gameReady", game.hostShips); //TODO: io.sockets.in(game.name).emit("gameReady");

            io.sockets.to(playerToStart).emit("playerToStart", true);
        }
    });

    /**
     * Sets the player to ready
     */
    socket.on("playerReady", function(data) {

        console.log("player is ready. . .");
        var game = games[players[socket.id].game];
        game.playerReady = true;

        game.playerShips = data;

        if (game.hostReady && game.playerReady) {
            var playerToStart = chooseStartingPlayer(game);
            socket.emit("gameReady", game.hostShips);
            io.sockets.to(getOpponent()).emit("gameReady", game.playerShips); //TODO: io.sockets.in(game.name).emit("gameReady");

            io.sockets.to(playerToStart).emit("playerToStart", true);
        }
    });

    /******************************
     * 
     *          GAMEPLAY
     * 
     ******************************/ 

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
     * Tells the opponent to run the given perk at x,y
     */
    socket.on("usePerk", function(data){
        var opponent = getOpponent();
        io.sockets.to(opponent).emit("runPerk", data);
    });

    /**
     * Waits for response from oppenent of perk results, transmits the data back to the client (hit/miss)
     */
    socket.on("runPerkResponse", function (data) {
        var opponent = getOpponent();
        io.sockets.to(opponent).emit("usePerkResponse", data);
    });



    /**
     * Records the win/loss and ends the game.
     */
    socket.on("lostGame", function() {

        if (players[socket.id].game !== null){
            var opponent = getOpponent();

            io.sockets.to(socket.id).emit("lostGameResponse", true);//Loss
            io.sockets.to(opponent).emit("lostGameResponse", false);//Win
            
            leaveGame(); //end the game
        }
    });

    /******************************
     * 
     *          HELPER FUNCTIONS
     * 
     ******************************/ 
    

    function leaveGame() {

        //Get the game object that the player is in
        var game = games[players[socket.id].game];

        // alerting to all relevant that A player has left the game
        io.sockets.in(socket.game).emit("alert", "(" +players[socket.id].username + ") is leaving the game. The game has ended.");
        
        //Store the game ID
        var gameId = players[socket.id].game;

        //Iterate over connected clients, if that client is in this game remove them
 
        clients[socket.id].socket.leave(game.name);
        var opponent = getOpponent();
        if(opponent){
            clients[opponent].socket.leave(game.name);
            players[opponent].game = null;
        }
        players[socket.id].game = null;
        //Delete the game session
        delete games[gameId]; 

        // refresh games list
        io.sockets.emit("gameList", games);
    }

    /**
     * Returns person who is deemed to be the opponent
     */
    function getOpponent(){
        var game = games[players[socket.id].game];
        if (typeof(game.players[1]) != undefined) { // If two people are in the game
            var opponent;
            if (game.players[0] != socket.id) { // Compare your own socket id to each player in list to see who the opponent is
                opponent = game.players[0];
            } else{
                opponent = game.players[1];
            }
            return opponent;
        }
        return null; // Not two people in the game;
    }

    /**
     * Returns at random, who will start the game.
     */
    function chooseStartingPlayer(game) {
        var game = games[players[socket.id].game];
        var player = Math.round((Math.random()));
        return game.players[player];
    }
});
