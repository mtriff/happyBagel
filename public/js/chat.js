window.onload = function() {
 
    var messages = []; //store all the messages
    var socket = io.connect(); //socket object
    var sendButton = document.getElementById("send");
    var chatbody = document.getElementById("chatbody");
    var chatmessage = document.getElementById("chatmessage");
 
    //upon recieving the message from the server....
    socket.on('chat', function (data) {
        console.log("everone's got the data"+ data.chatmessage);
        var html = data.chatmessage + '<br/>';
        chatbody.innerHTML += html;
        chatbody.scrollTop = chatbody.scrollHeight;
    });
 
    //send message if sendButton is clicked or 
    sendButton.onclick = sendMessage = function() {
        socket.emit('chat', {chatmessage: chatmessage.value});
        chatmessage.value = "";
    };
    //or enter is pressed
    $(document).ready(function(){
        $("#chatmessage").keyup(function(e){
            if (e.keyCode == 13){
                sendMessage();
            }
        });
    });

}