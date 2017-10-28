var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
	app.use(express.static(__dirname + '/client'));
});

io.on('connection', function(socket){
	var name = "";
	socket.on('setUsername', function(nick){
		name = nick;
		if(users[name]){ //if taken
			socket.emit('invalidName', "Username taken.");
		} else if(name.trim() == "") { //if just space/tab/nothing
			socket.emit('invalidName', "Username must contain non-whitespace characters.");
		} else {
			socket.emit('validName', name);
			io.emit('userJoin', name);
			users[name] = socket;
		}
	});

	socket.on('disconnect', function(){
		io.emit('userLeave', name);
		delete users[name];
	});

	//room stuff
	socket.on('joinRoom', function(id){
		var nsp = io.nsps['/'].adapter.rooms[id];
		if(nsp){
   			socket.join(id);

   			socket.emit('joinedRoom', id)

   			io.sockets.in(id).emit('userJoinedRoom', name);

   			//any other room get stuff.

   		} else {
			socket.emit('joinedRoomErr', "Room does not exist")
   		}
	});

	socket.on('createRoom', function(){
		do {
			id = makeid()
			var nsp = io.nsps['/'].adapter.rooms[id];
		} while(nsp);

   		socket.join(id);
   		socket.emit('createdRoom', id)

   		//some room init stuff

   		}
	});

});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
