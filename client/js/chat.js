$(document).ready(function() {

	socket.on("usersOnline", function(arr) {
		console.log(arr);
		console.log("Hello");
	});
});
