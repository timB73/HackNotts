$(document).ready(function() {

	socket.on("usersOnline", function(arr) {
		var online = JSON.parse(arr);
		var index = online.indexOf(name);
		if(index > -1) {
			online.splice(index, 1);
		}

		for(var i = 0; i < online.length; i++) {
			$("#users-online").append("<option>" + online[i] + "</option>");
		}

		
	});
});
