$(document).ready(function() {
	for(var i=0; i<toolNames.length;i++){
		var $button = $('<button id="close-image" data-id="'+i+'" style="top:'+(40+(40*i))+'px;left:5px;"><img src="/icons/'+toolNames[i][1]+'"></button>');
		$button.click(function(){
			tool = $(this).data("id");
			console.log(tool);
		});
		$('#toolbar').append($button);
	}
});

