var whiteboard = document.getElementById("whiteboard");
var ctx = whiteboard.getContext("2d");
var drawId = null;

var tool = 1;
var toolNames = [["Freeform line","001-random-line.png"], ["Straight line", "002-substract.png"], []];

$(document).ready(function() {



    var localDrawInfo = [];

    $('#copy-code').click(function(){
        var ret = copyToClipboard(findGetParameter("id"));
        $('#copy-code-error').text(ret);
        $('#copy-code-error').show();
        setTimeout(function(){
            $('#copy-code-error').fadeOut();
        }, 2000);
    });


    var mouseDown = 0;
    var drawStatus = "inactive";
    $("#whiteboard").mousedown(function(){
        if(mouseDown == 0){
            socket.emit('initDraw', tool);
            drawStatus = "pending";
        }
        ++mouseDown;
    })

    $("#whiteboard").mouseup(function(){
        --mouseDown;
        if(mouseDown == 0){
            drawId = null;
        }
    })

    $("#whiteboard").mousemove(function(evt){
        var pos = getMousePos(document.getElementById("whiteboard"), evt)
        var sendData = {pos: pos, id: drawId, type:tool};
        if(mouseDown && drawStatus == "drawing"){
            socket.emit('drawPoint', JSON.stringify(sendData));
            draw(tool, drawId, pos);
        }
    });

    function draw(type, tmpDrawId, pos){
        drawPoints = localDrawInfo[tmpDrawId].points;
        if(type == 1){
            if(drawPoints.length != 0) {
                drawLine(drawPoints[drawPoints.length-1], pos);
            }

        }
        drawPoints.push(pos);
        localDrawInfo[tmpDrawId].points = drawPoints;
    }

    socket.on('fullData', function(data){
        data = JSON.parse(data);
        ctx.clearRect(0, 0, whiteboard.width, whiteboard.height);
        for(var i=0; i<data.length;i++){
            var element = data[i];
            var points = element.points;
            localDrawInfo[i] = {type:element.type, points:[]}
            for(var p = 0; p<points.length;p++){
                draw(element.type, i, points[p]);
            }
        }
        console.log(localDrawInfo);
    });

    socket.on('initDrawId', function(data){
        data = JSON.parse(data);

        if(data.name == name){
            drawStatus = "drawing";
            drawId = data.id;
            tmpId = drawId;
            type = tool;
        } else {
            type = data.type;
            tmpId = data.id;
        }
        localDrawInfo[tmpId] = {type:type,points:[]}
    });

    socket.on("drawPoint", function(data) {
        console.log(data);
        var data = JSON.parse(data);

        draw(data.type, data.id, data.pos);
    });


});

function drawLine(start,end){

    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.lineTo(end.x,end.y);
    ctx.stroke();
}

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
	$("#createOrJoin-form, #username-corner").fadeOut()
    setTimeout(function() {
		$("#whiteboard-row").fadeIn();
	}, 500);
}
