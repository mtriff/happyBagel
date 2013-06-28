var resizeDivs = function(){

	//resize chat area box
	var height_navBar = 52;
	var height_newNote = 120;
	var height_users = 130;
	var height_chatInput = 48;
	//console.log($(window).height()+"."+height_navBar+"."+height_newNote+"."+height_users+"."+height_chatInput);
	var chatArea = document.getElementById('chatArea_box');
	chatArea.style.height = $(window).height() - height_navBar - height_newNote - height_users - height_chatInput + "px";
	console.log("setting chat area to "+chatArea.style.height);
	chatArea.scrollTop = 10000;

	//resize main notes container

	var mainNotes = document.getElementById('main_notes_container');
	mainNotes.style.height = $(window).height() - height_navBar - 50 + "px";

}


var updateUserColor = function () {
	$("#user_color").mouseover(function(){
		$("#user_selectColor").slideToggle();
	});

	$(".colorSelected").click(function(){
		$("#user_selectColor").slideToggle();
		$("#chatArea_input").focus();
	})
}
var updateUsername = function (socket) {

	$("#user_self")
		.keyup(function(e){
        	if (e.keyCode == 13 || e.keyCode == 27){
        		$(this).blur();
        	}
    	})
    	.blur(function(){
    		$("#chatArea_input").focus();
	    	socket.emit('chat', {cmd:"name", 
				message: {
					userId: $("#user_self").attr("name"),
					name: $(this).val()
				}}
			);

    	})
    	.focus(function(){
    		$(this).select();
    	})
    	.mouseup(function(e){
    		e.preventDefault();
    	});
}


/*
	DEPRECIATED
	replaced with angular code
*/
var updateChatBox = function (){
	var messages = [];
	var socket = io.connect(window.location.pathname);
	var chatbody = document.getElementById("chatArea_box");
	var chatmessage = document.getElementById("chatArea_input");


	var addChatMessage = function (data) {
		console.log("chat:"+ data.chatmessage);
        var html = data.chatmessage + '<br/>';
        chatbody.innerHTML += '<FONT COLOR="#bc8f8f">text text text text text</FONT>';
        chatbody.innerHTML += html;
        chatbody.scrollTop = chatbody.scrollHeight;
	}

	socket.on('chat', function (data) {
        addChatMessage(data);
    });


    $("#chatArea_input").keyup(function(e){
        if (e.keyCode == 13){
            socket.emit('chat', {chatmessage: chatmessage.value});
    		addChatMessage({chatmessage: chatmessage.value});
    		chatmessage.value = "";
        }
    });

}


$(document).ready(function(){
	var socket = io.connect(window.location.pathname);
	resizeDivs();
	updateUserColor();
	updateUsername(socket);
	//updateChatBox();
});

$(window).resize(function(){
	resizeDivs();
});



function handleNoteSize(ele, event)
{
	console.log("lets find the id of this ele");
	console.log(ele);
	console.log(event);
	switch(event){
		case 'focus':
			ele.style.height = 'auto';
			ele.style.overflow = 'hidden';
			var newHeight = (ele.scrollHeight > 32 ? ele.scrollHeight : 32);
			ele.style.height = newHeight.toString() + 'px';
			break;
		case 'focusOut':

		//	ele.style.height = '48px';
		//	ele.style.overflow= 'scroll';

			break;
		case 'keyUp':
			ele.style.height = 'auto';
			var newHeight = (ele.scrollHeight > 32 ? ele.scrollHeight : 32);
			ele.style.height = newHeight.toString() + 'px';
			break;

	}	

	
}

