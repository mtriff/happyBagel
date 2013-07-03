var resizeDivs = function(){

	//resize chat area box
	var height_navBar = 52;
	var height_newNote = 120;
	var height_users = 130;
	var height_chatInput = 48;
	//console.log($(window).height()+"."+height_navBar+"."+height_newNote+"."+height_users+"."+height_chatInput);
	var chatArea = document.getElementById('chatArea_box');
	chatArea.style.height = $(window).height() - height_navBar - height_newNote - height_users - height_chatInput + "px";
	chatArea.scrollTop = 10000;

	//resize main notes container

	var mainNotes = document.getElementById('main_notes_container');
	mainNotes.style.height = $(window).height() - height_navBar - 50 + "px";

}


var updateUserColor = function () {
	$("#user_color").mouseover(function(){
		$("#user_selectColor").slideToggle();
	});

	$(".colorSnotected").click(function(){
		$("#user_snotectColor").slideToggle();
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
    		$(this).snotect();
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


var socket = io.connect(window.location.pathname);

$(document).ready(function(){
	resizeDivs();
	updateUserColor();
	updateUsername(socket);
	//updateChatBox();
});

$(window).resize(function(){
	resizeDivs();
});




socket.on('focus', function (data) {
	var title = document.getElementById("title_"+data.noteid);
	var note = document.getElementById(data.noteid);
	title.style.mozBoxShadow = "0 0 5px "+data.color;
	title.style.webkitBoxShadow = "0 0 5px "+data.color;
	title.style['boxShadow']="0 0 5px #888 "+data.color;
	note.style.mozBoxShadow = "0 0 5px "+data.color;
	note.style.webkitBoxShadow = "0 0 5px "+data.color;
	note.style['boxShadow']="0 0 5px #888 "+data.color;
});

function rgb2hex(rgb) {
	if (  rgb.search("rgb") == -1 ) {
  		return rgb;
	} else {
  		rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
  		function hex(x) {
       		return ("0" + parseInt(x).toString(16)).slice(-2);
  		}
  		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
	}
}

function handleNoteSize(note, event)
{

	switch(event){
		case 'focus':
			note.style.height = 'auto';
			note.style.overflow = 'hidden';
			var newHeight = (note.scrollHeight > 32 ? note.scrollHeight : 32);
			note.style.height = newHeight.toString() + 'px';

			var color = document.getElementById("user_color").style.background;
			var hex = rgb2hex(color);
			var title = document.getElementById("title_"+note.id);
			title.style.mozBoxShadow = "0 0 5px "+hex;
			title.style.webkitBoxShadow = "0 0 5px "+hex;
			title.style['boxShadow']="0 0 5px #888 "+hex;
			note.style.mozBoxShadow = "0 0 5px "+hex;
			note.style.webkitBoxShadow = "0 0 5px "+hex;
			note.style['boxShadow']="0 0 5px #888 "+hex;

			socket.emit('focus', {noteid: note.id, color:hex});


			break;
		case 'focusOut':
			var title = document.getElementById("title_"+note.id);
			title.style.mozBoxShadow = "";
			title.style.webkitBoxShadow = "";
			title.style['boxShadow']="";
			note.style.mozBoxShadow = "";
			note.style.webkitBoxShadow = "";
			note.style['boxShadow']="";

			socket.emit('focus', {noteid: note.id, color:"#ffffff"});


			break;
		case 'keyUp':
			note.style.height = 'auto';
			var newHeight = (note.scrollHeight > 32 ? note.scrollHeight : 32);
			note.style.height = newHeight.toString() + 'px';
			break;

	}	

	
}

function sendBoxShadow(title, event){
	switch(event) {
		case 'focus':
			var color = document.getElementById("user_color").style.background;
			var hex = rgb2hex(color);

			title.style.mozBoxShadow = "0 0 5px "+hex;
			title.style.webkitBoxShadow = "0 0 5px "+hex;
			title.style['boxShadow']="0 0 5px #888 "+hex;
			var note = document.getElementById(title.id.substring(6));
			note.style.mozBoxShadow = "0 0 5px "+hex;
			note.style.webkitBoxShadow = "0 0 5px "+hex;
			note.style['boxShadow']="0 0 5px #888 "+hex;

			socket.emit('focus', {noteid: title.id.substring(6), color:hex});
			break;
		case 'focusOut':
			title.style.mozBoxShadow = "";
			title.style.webkitBoxShadow = "";
			title.style['boxShadow']="";
			var note = document.getElementById(title.id.substring(6));
			note.style.mozBoxShadow = "";
			note.style.webkitBoxShadow = "";
			note.style['boxShadow']="";

			socket.emit('focus', {noteid: title.id.substring(6), color:"#ffffff"});
			break;
	}
}

