$(function(){
	var socket = io();
	var name = "";

	// tmp set username
	$('#user-submit').click(function(){
		name = $('username').val();
		socket.emit('setUsername', name);
		return false;
	});

	socket.on('invalidName', function(err){
		$('#error-msg').val(err);
		$('#error-wrap').show();
	});

	socket.on('validName', function(valName){
		name = valName;
		alert("Name "+name+" accepted.");
	});



});
