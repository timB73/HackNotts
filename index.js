var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
	var name = "";
	socket.on('setUsername', function(nick){
		name = nick;
		if(users[name]){
			socket.emit('invalidName', "Username taken.");
		} else if(name.trim() == "") {
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

});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});
