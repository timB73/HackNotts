var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
	app.use(express.static(__dirname + '/client'));
});

io.on('connection', function(socket){

	//username parsing
	var name = ""
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

	socket.on('createRoom', function(id){
		var nsp = io.nsps['/'].adapter.rooms[id];
		if(!nsp){
   			socket.join(id);
   			socket.emit('createRoom', id)

   			//some room init stuff

   		} else {
			socket.emit('createRoomErr', "Room already exists")
   		}
	});

});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
