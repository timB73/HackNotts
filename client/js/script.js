$(function(){
	var socket = io();
	var name = "";

	// tmp set username
	$('#user-submit').click(function(){
		name = $('#username').val();
		socket.emit('setUsername', name);
		return false;
	});

	socket.on('invalidName', function(err){
		$('#error-msg').text(err);
	});

	socket.on('validName', function(valName){
		name = valName;
		alert("Name "+name+" accepted.");
	});



});
