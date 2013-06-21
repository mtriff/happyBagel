var resizeChatArea = function(){
	var height_navBar = document.getElementById('nav').clientHeight;
	var height_newNote = document.getElementById('side_newNote').clientHeight;
	var height_users = document.getElementById('side_user').clientHeight;
	var height_chatInput = document.getElementById('chatArea_input').clientHeight;
	
	console.log($(window).height()+"."+height_navBar+"."+height_newNote+"."+height_users+"."+height_chatInput);
	var chatArea = document.getElementById('chatArea_box');

	chatArea.style.height = $(window).height() - height_navBar - height_newNote - height_users - height_chatInput + "px";
	chatArea.scrollTop = 10000;

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
	resizeChatArea();
	updateUserColor();
	updateUsername(socket);
	//updateChatBox();
});

$(window).resize(function(){
	resizeChatArea();
});


