
var note = require("../models/note.js");

exports.setUpSockets =  function (path, io){
	io.of(path).on('connection', function(socket){
		var room = socket.namespace.name;

		socket.broadcast.emit('general',"someone has joined");
		
		//initial load 
		note.initLoad(room, socket);

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

		//listener for chat
		/* TODO: FINISH
		socket.on('chat', function(data){
			console.log('chat data:'+data);

			//tell others to add to chat box
			io.sockets.emit('chat', data);
		});
		*/

	})
}