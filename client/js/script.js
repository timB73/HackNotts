var name = "";
var userCol = "";
$(function(){

	var tmpId = findGetParameter("id");
	if(sessionStorage.getItem("userData") != null && tmpId) {
		var userData = JSON.parse(sessionStorage.getItem("userData"));
		name = userData.name;
		userCol = userData.colour;
		penColour = userCol;
		socket.emit("doesRoomExist", tmpId);
	}

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
			$('#joinRoomId').fadeIn();
			$('#joinRoomId').focus();
		} else {
			socket.emit('joinRoom', $('#joinRoomId').val());
		}
		return false;

	});
	socket.on("roomExists", function(exists){
		if(!exists) {
			sessionStorage.clear();
			window.history.pushState({}, '', '?');
		}else { // the room exists
			socket.emit("writeSessionData", sessionStorage.getItem("userData"));
			validUsername();
			socket.emit("joinRoom", tmpId);
		}
	});

	socket.on('validRoom', function(id){
		// window.location.href="whiteboard.html?id="+id+"&name="+name;
			goToRoom(id);

	});

	socket.on('invalidRoom', function(err){
		$('#join-error-msg').text(err);
		console.log(err);
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

	socket.on('validName', function(col){
		userCol = col;
		penColour = userCol;
		validUsername();
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

	function validUsername() {
		$('#whiteboard-bar').css("background-color", userCol);
		$('#username-form').fadeOut();
		$('#username-corner').text(name);
		$("#nickname-val").text(name);
		sessionStorage.setItem("userData", JSON.stringify({name: name, colour: userCol}));
	}

	function goToRoom(roomID) {
		window.history.pushState({}, '', '?id='+roomID);
		showWhiteboard();
		$('#code-txt').val(findGetParameter("id"));
	}


});
