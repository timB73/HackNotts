$(document).ready(function() {
	for(var i=0; i<toolNames.length;i++){
		var $button = $('<button class="close-image" id="toolBarEl'+i+'" data-id="'+i+'" style="top:'+(40+(40*i))+'px;left:5px;"><img src="/icons/'+toolNames[i][1]+'"></button>');
		$button.click(function(){
			for(var k=0; k<toolNames.length; k++){
				$('#toolBarEl'+k).css("background-color", "#E1E1E1");
			}
			tool = $(this).data("id");
			$(this).css("background-color", "#AAAAAA");
			console.log(tool);
		});
		$('#toolbar').append($button);
	}
});

