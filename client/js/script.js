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

		$("#whiteboard-row").show();
		return false;

	});

	socket.on('createdRoom', function(id){
		window.location.href="whiteboard.html?id="+id+"&name="+name;
	});

	$('#joinRoom').click(function(){
		var vis = $('#joinRoomId').is(":visible")
		if(!vis){
			$('#joinRoomId').fadeIn()
		} else {
			socket.emit('joinRoom', $('#joinRoomId').val());
		}
		
		$("#whiteboard-row").show();
		return false;

	});

	socket.on('validRoom', function(id){
		window.location.href="whiteboard.html?id="+id+"&name="+name;
	});

	socket.on('invalidRoom', function(err){
		$('#join-error-msg').text(err);
		setTimeout(function() {
			$("#join-error-msg").fadeOut();
		}, 2000);

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
