var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

var data = {};

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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
	var roomId = "";
	var col = "";
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
			col = colorArray[Math.floor(Math.random() * colorArray.length)];
			socket.emit('validName', col);
			io.emit('userJoin', name);
			users[name] = socket;
		}
	});

	socket.on('disconnect', function(){
		io.emit('userLeave', name);
		if(roomId!=""){
			io.to(roomId).emit('serverMsg', name+" has left the room.");
		}
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
   			
   			roomId = id;
   			(data[id].users).push(name);

   			sendPlys();

   			io.to(roomId).emit('serverMsg', name+" has joined the room.");

   		} else {
			socket.emit('invalidRoom', "Room does not exist")
   		}
	});

	function sendPlys() {
		var users = data[roomId].users;
		io.to(roomId).emit('usersOnline', JSON.stringify(users));
		
	}

	socket.on('createRoom', function(){
		do {
			id = makeid()
			var nsp = io.nsps['/'].adapter.rooms[id];
		} while(nsp);

   		socket.join(id);
   		socket.emit('createdRoom', id)

   		roomId = id;

   		data[id] = {users:[name], drawInfo:[]};

   		sendPlys();

   		io.to(roomId).emit('serverMsg', name+" has joined the room.");
   	});

	//draw handling

	socket.on('initDraw', function(type){
		drawId = data[roomId].drawInfo.length;
		data[roomId].drawInfo[drawId] = {type:type, points:[]}
		socket.emit('initDrawId', drawId);
	});



	//chat handling

	socket.on('sendMsg', function(data){
		var sendObj = {sender:name, msg:data, colour:col}
		socket.broadcast.emit('receiveMsg', JSON.stringify(sendObj));
	});

});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
