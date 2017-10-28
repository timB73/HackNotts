$(document).ready(function() {





	$("#whiteboard").mousedown(function() {

	});

});

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    var msg;
    try {
        var successful = document.execCommand('copy');
        msg = successful ? 'Copied' : 'Unable to copy :(';
        
    } catch (err) {
        msg = 'Unable to copy :(';

    }

    return msg;

    $temp.remove();
}

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

function showWhiteboard() {
	$("#createOrJoin-form, #username-corner").fadeOut(function() {
		$("#whiteboard-row").fadeIn();
	});
}
