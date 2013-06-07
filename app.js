

var express = require('express'), 
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	mime = require('mime'),
	path = require('path');

io.set('log level', 1);

var note = require("./models/note.js");

app.configure(function() {
	app.use(express.favicon());//serve default favicon
	app.use(express.logger('dev'));//output development-friendly colored logs
	app.use(express.bodyParser());//parse request bodies
	app.use(express.methodOverride());
	
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});


function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents){
	response.writeHead(
		200,
		{"content-type":mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, absPath){
	
	//check if file exists
	fs.exists(absPath, function (exists){
		if (exists){
			//read file from disk
			fs.readFile(absPath, function (err, data){
				if(err){
					send404(response);
				}
				else {
					//and serve file from disk
					sendFile(response, absPath, data);
				}
			})
		} 
		else {
			send404(response);
		}
	});

}



app.get("/*", function (req, res){
	console.log("Get request for " + req.url);	

	// TODO: change this 
	var filePath = false;
	filePath = 'public/main.html';
	var absPath = './' + filePath;
	serveStatic(res, absPath);
	// ---------------

	//TODO: grab room data from db for that room
});

//socket stuff
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


