var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

var data = {};

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
	//res.sendFile(__dirname + '/client/whiteboard.html');
	app.use(express.static(__dirname + '/client'));
});

io.on('connection', function(socket){
	var name = "";
	var id = "";
	socket.on('setUsername', function(nick){
		name = nick.trim();
		if(users[name]){ //if taken
			socket.emit('invalidName', "Username taken.");
		} else if(name == "") { //if just space/tab/nothing
			socket.emit('invalidName', "Username must not be blank.");
		} else if(name.match(/[\W_]+/g) != null) {
			socket.emit('invalidName', "Username contains illegal characters.");
		} else if(name.length < 3){
			socket.emit('invalidName', "Username must be at least 3 characters.");
		} else {
			socket.emit('validName', name);
			io.emit('userJoin', name);
			users[name] = socket;
		}
	});

	socket.on('disconnect', function(){
		io.emit('userLeave', name);
		console.log("discon");
		delete users[name];
	});

	//room stuff
	socket.on('joinRoom', function(id){

		if(id.length!=5){
			socket.emit('invalidRoom', "Room id must be 5 characters.");
		} else if(id.match(/[\W_]+/g) != null){
			socket.emit('invalidRoom', "Room id contains illegal characters.");
		}

		var nsp = io.nsps['/'].adapter.rooms[id];
		if(nsp){
   			socket.join(id);

   			socket.emit('validRoom', id)

   			io.sockets.in(id).emit('userJoinedRoom', name);

   			(data[id].users).push(name);

   		} else {
			socket.emit('invalidRoom', "Room does not exist")
   		}
	});

	socket.on('getUsersInRoom', function(){
		var users = data[socket.rooms[0]].users;
		socket.emit('usersOnline', JSON.stringify(users));
		
	});

	socket.on('createRoom', function(){
		do {
			id = makeid()
			var nsp = io.nsps['/'].adapter.rooms[id];
		} while(nsp);

   		socket.join(id);
   		socket.emit('createdRoom', id)

   		data[id] = {users:[name], drawInfo:[]};
	});

	//draw handling

	socket.on('initDraw', function(type){
		drawId = data[id].drawInfo.length;
		data[id].drawInfo[drawId] = {type:type, points:[]}
		socket.emit('initDrawId', drawId);
	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
