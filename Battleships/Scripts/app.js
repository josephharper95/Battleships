var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(4000);

app.get('/', function(req, res){
	res.sendFile(__dirname + '../Content/Pages/startMultiplayer.php');
});

io.sockets.on('connection', function(socket){
    console.log("connection established");
});