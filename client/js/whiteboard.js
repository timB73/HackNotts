$(document).ready(function() {
	var socket = io();


	var url = window.location.href;
	var whiteboardID = findGetParameter("id");
	if(whiteboardID !== null) {
		showWhiteboard();
	}
	socket.emit("setUsername", name);


	socket.on("invalidName", function(err) {
		name = prompt("Error: " + err + " Enter a username", "");
		socket.emit("setUsername", name);
	});


	$("#whiteboard").mousedown(function() {

	});




	function findGetParameter(parameterName) {
	    var result = null,
	        tmp = [];
	    location.search
	        .substr(1)
	        .split("&")
	        .forEach(function (item) {
	          tmp = item.split("=");
	          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	        });
	    return result;
	}

});

function showWhiteboard() {
	$("#createOrJoin-form, #username-corner").fadeOut(function() {
		$("#whiteboard-row").fadeIn();
	});
}
