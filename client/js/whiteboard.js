$(document).ready(function() {

    var tool = 1;
    var toolNames = ["Freeform line"];

    $('#code-code').click(function(){
        var ret = copyToClipboard(findGetParameter("id"));
        $('#code-code-error').text(ret);
        $('#code-code-error').show()
        setTimeout(function(){
            $('#code-txt-error').fadeOut();
        }, 2000);
    });

    var whiteboard = $('#whiteboard')

    var mouseDown = 0;
    var drawStatus = "inactive";
    whiteboard.mousedown(function(){
        if(mouseDown == 0){
            socket.emit('initDraw', tool);
            drawStatus = "pending";
        }
        ++mouseDown;
    })

    whiteboard.mouseup(function(){
        --mouseDown;
    })

    whiteboard.mousemove(function(evt){
        var pos = getMousePos(whiteboard, evt);
        if(mouseDown){

        }
    });

	

});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
        y: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
    };
}

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(txt).select();
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
