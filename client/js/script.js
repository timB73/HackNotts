var name = "";
$(function(){

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
		// window.location.href="whiteboard.html?id="+id+"&name="+name;
		showWhiteboard();
		window.history.pushState({}, '', '?id='+id);
		$('#code-txt').val(findGetParameter("id"));
	});

	$('#joinRoom').click(function(){
		var vis = $('#joinRoomId').is(":visible")
		if(!vis){
			$('#joinRoomId').fadeIn()
		} else {
			socket.emit('joinRoom', $('#joinRoomId').val());
		}
		return false;

	});

	socket.on('validRoom', function(id){
		// window.location.href="whiteboard.html?id="+id+"&name="+name;
		window.history.pushState({}, '', '?id='+id);
		showWhiteboard();
		$('#code-txt').val(findGetParameter("id"));
	});

	socket.on('invalidRoom', function(err){
		$('#join-error-msg').text(err);
		$('#join-error-msg').show();
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
			var url = window.location.href;
			var whiteboardID = findGetParameter("id");
			if(whiteboardID !== null){
				socket.emit('joinRoom', whiteboardID);
			} else {
				$('#createOrJoin-form, #username-corner').fadeIn();
			}
		}, 500);
	});



});
