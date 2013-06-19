

var express = require('express'), 
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	mime = require('mime'),
	path = require('path'),
	helper = require('./controllers/sockethelper');

io.set('log level', 1);
express.static.mime.define({'application/font-woff': ['woff']});
 
//set up room list and socket connections
var note = require("./models/note.js");
var arrayOfRooms = [];
note.findAllRooms(arrayOfRooms, io);

app.configure(function() {
	app.use(express.favicon());//serve default favicon
	app.use(express.logger('dev'));//output development-friendly colored logs
	app.use(express.bodyParser());//parse request bodies
	app.use(express.methodOverride());
	
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});


function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents){

	console.log("mime type:"+mime.lookup(path.basename(filePath)));
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

	serveStatic(res, "./public/main.html");	

	console.log("GET request " + req.url);	
	if (searchStringInArray(req.url, arrayOfRooms) == -1){
		console.log(" created room");
		helper.setUpSockets(req.url,io);

		//store
		note.addNewRoom(req.url); 
		arrayOfRooms.push(req.url);
	}
	else {
		console.log(" joined room");
		
	}


});


server.listen(1337, function(){
	console.log("server listening 1337");
});


