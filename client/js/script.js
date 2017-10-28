$(function(){
	var socket = io();

	// tmp set username
	var name = prompt("Please enter a username", "");
	socket.emit('setUsername', name);
	socket.on('invalidName', function(err){
		name = prompt(err+" Please enter a username", "");
		socket.emit('setUsername', name);
	});

	socket.on('validName', function(valName){
		name = valName;
		alert("Name "+name+" accepted.");
	});



});
