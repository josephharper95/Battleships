var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

// Loading the page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, username) {
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username) {
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });

    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {username: socket.username, message: message});
    }); 
});

server.listen(3000);