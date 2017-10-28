$(function(){
	var socket = io();
	var name = "";

	// tmp set username
	$('#user-submit').click(function(){
		name = $('#username').val();
		socket.emit('setUsername', name);
		return false;
	});

	$('#createRoom').click(function(){
		socket.emit('createRoom');



		return false;

	});

	socket.on('createdRoom', function(id){
		alert(id);
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
		$('#username-form').fadeOut();
		$('#username-corner').text(name);
		setTimeout(function(){
			$('#createOrJoin-form, #username-corner').fadeIn();
		}, 500);
	});



});
