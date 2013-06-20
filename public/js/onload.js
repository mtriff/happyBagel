var resizeChatArea = function(){
	var height_navBar = document.getElementById('nav').offsetHeight;
	var height_newNote = document.getElementById('side_newNote').offsetHeight;
	var height_users = document.getElementById('side_user').offsetHeight;
	var height_chatInput = document.getElementById('chatArea_input').offsetHeight;
	
	//console.log($(window).height()+"."+height_navBar+"."+height_newNote+"."+height_users+"."+height_chatInput);
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
	})
}
var updateUsername = function () {


	$("#user_self")
		.keyup(function(e){
        	if (e.keyCode == 13){
        		console.log("enter! now take focus off");
        		$(this).blur();
        	}
    	})
    	.blur(function(){
    		console.log("clicked outside");

    	})
    	.focus(function(){
    		console.log("just clicked, select all");
    		$(this).select();
    	})
    	.mouseup(function(e){
    		e.preventDefault();
    	});
}

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
	resizeChatArea();
	updateUserColor();
	updateUsername();
	updateChatBox();
});

$(window).resize(function(){
	resizeChatArea();
});
