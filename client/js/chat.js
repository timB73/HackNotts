$(document).ready(function() {

	socket.on("usersOnline", function(arr) {
		var online = JSON.parse(arr);
		var index = online.indexOf(name);
		if(index > -1) {
			online.splice(index, 1);
		}
		$(".user-online").remove();
		for(var i = 0; i < online.length; i++) {
			$("#users-online").append("<option class='user-online'>" + online[i] + "</option>");
		}

	});

	$("#chat-form").submit(function(e) {
		e.preventDefault();

		var message = $("#chat-msg").val();
		if(message == "") {
			return;
		}
		message = message.trim();
		$("#chat-msg").val("");
		$("#chat-messages-list").append("<li><span style='font-weight: bold; color: " + userCol + ";'>You:</span> " + message + "</li>");
		socket.emit("sendMsg", message);
	});

	socket.on("receiveMsg", function(data) {
		var chatData = JSON.parse(data);
		$("#chat-messages-list").append("<li><span style='color: " + chatData.colour + ";'>" + chatData.sender + ":</span> " + chatData.msg + "</li>");
	});

	socket.on("serverMsg", function(msg) {
		$("#chat-messages-list").append("<li style='color: red;'>" + msg + "</li>");
	});


});
