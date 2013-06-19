
var note = require("../models/note.js");

exports.setUpSockets =  function (path, io){
	var userId = 0;
	io.of(path).on('connection', function(socket){
		var room = socket.namespace.name;

		socket.broadcast.emit('general',"someone has joined");
		
		//initial load 
		note.initLoad(room, socket);
		
		//listener for users joining the room
		socket.on('joinRoom', function(data){
			console.log("user joined");
			userId = userId + 1;
			socket.emit('joinRoom',userId);
		})


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

		//chat
		socket.on('chat', function(data){
			console.log('chat data:'+data);

			//add to database

			socket.broadcast.emit('chat', data);
		});

	})
}