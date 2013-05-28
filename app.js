
/*
declaration and instantiating nodejs modules
	declaring express, and instantiating
	creating http server
	instantiating socket.io
*/
var express = require('express'), 
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var note = require("./models/note.js");
/*
tell our express app to use our public directory to serve files
*/
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});


/* Wiring up socket.io, event listeners and callbacks

we're simply broadcasting what event happened so any client listening can be notified

*/
io.sockets.on('connection', function(socket) {
	//load all notes
	note.findAll(socket);

	//load chat history

	socket.on('createNote', function(data) {
		note.saving(data);
		socket.broadcast.emit('onNoteCreated', data);
	});

	socket.on('updateNote', function(data) {
		note.updateNote(data);
		socket.broadcast.emit('onNoteUpdated', data);
	});

	socket.on('moveNote', function(data){
		socket.broadcast.emit('onNoteMoved', data);
	});

	socket.on('deleteNote', function(data){
		note.deleteNote(data);
		socket.broadcast.emit('onNoteDeleted', data);
	});

	socket.on('filter', function(data){
		console.log("filter handler: "+data);
		//clear
		note.removeAll();
	});
	
	socket.on('chat', function(data){
		console.log('chat data:'+data);
		//TODO: put into database

		//tell others to add to chat box
		io.sockets.emit('chat', data);
	})
});


/*
start up the server and listen to 1337
*/
server.listen(1337, function(){
	console.log("Server listening to 1337");
});


