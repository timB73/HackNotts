$(document).ready(function() {
	for(var i=0; i<toolNames.length;i++){
		var $button = $('<button id="close-image" style="top:'+(40+(40*i))+'px;left:5px;"><img src="/icons/'+toolNames[i][1]+'"></button>');
		$button.click(function(){
			tool = i;
			console.log(i);
		});
		$('#toolbar').append($button);
	}
});

