
var note = require("../models/note.js");

exports.setUpSockets =  function (path, io){
	var userId = 0;
	var userList = [];

	io.of(path).on('connection', function(socket){
		var room = socket.namespace.name;

		
		//initial load 
		note.initLoad(room, socket);
		
		//listener for joining room
		socket.on('joinRoom', function(data){

			console.log("user joined");
			userId = userId + 1;
			socket.username = userId;

			user = {
				id:userId,
				name:userId
			};
			userList.push(user);

			socket.emit('joinRoom',userId);
			io.of(path).emit('updateUserList', userList);


		})

		//disconnect
		socket.on('disconnect', function(data){
			console.log("disconnected user "+socket.username);
			for (var i=0;i<userList.length;i++){
				if (userList[i].id == socket.username){
					userList.splice(i,1);
					break;
				}

			}
			io.of(path).emit('updateUserList', userList);

		});

		//chat
		socket.on('chat', function(data){
			switch(data.cmd){
				case 'name':
					for (var i=0;i<userList.length;i++){
						if (userList[i].id == data.message.userId){
							userList[i].name = data.message.name;
							break;
						}
					}
					io.of(path).emit('updateUserList', userList);
					break;
				case 'color':
					for (var i=0;i<userList.length;i++){
						if (userList[i].id == data.message.userId){
							userList[i].color = data.message.color;
							break;
						}
					}
					io.of(path).emit('updateUserList', userList);
					break;
				case 'message':
					//TODO: save to db for history?
					socket.broadcast.emit('chat', data.message);
					break;
			}			
			
		});


		//listener for notes
		socket.on('createNote', function(data) {
			note.saveNote(room, data);
			socket.broadcast.emit('onNoteCreated', data);
		});

		socket.on('updateNote', function(data) {
			note.updateNote(room, data);
			socket.broadcast.emit('onNoteUpdated', data);
		});

		socket.on('deleteNote', function(data){
			note.deleteNote(room,data);
			socket.broadcast.emit('onNoteDeleted', data);
		});

		

	})
}

















