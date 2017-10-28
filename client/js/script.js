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
		$("#error-msg").show();
		setTimeout(function() {
			$("#error-msg").fadeOut();
		}, 2000);
	});

	socket.on('validName', function(valName){
		name = valName;
		alert("Name "+name+" accepted.");
	});



});
