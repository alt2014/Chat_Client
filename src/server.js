var http = require('http');
var socket = require('socket.io');
var fs     = require('fs');

function staticFile(req, res) {
	fs.readFile(__dirname + '/../www/index.html', function(err, data) {
		if (err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
		console.log("Requested:" + req.url);
	});
}



exports.init = function(PORT){

	var app = http.createServer(staticFile);
	app.listen(PORT);
	var io = socket.listen(app);
	io.sockets.on('connection', function(socket){
		socket.emit('message', "Welcome to the chatroom!");
		console.log("connection successful");
		socket.on('chatSent', function(data){
			console.log('Chat recieved by server');
			socket.emit('recieveChat', data);
			socket.broadcast.emit('recieveChat', data);
		});
	});
	console.log("Server listening");

}
