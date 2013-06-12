var Notes = require('../models/Notes');
var helper = require('../controllers/sockethelper');

exports.saving = function(data){ //dir from which to serve files
	console.log("saving: ", data);
	//try to save something in the database
	var note = new Notes( {
		room: "some room",
		id: data.id,
		title:data.title,
		body: data.body,
	});

	note.save(function(err){
		if (err){
			console.log("some err with save");
		}
		else{
			console.log("save done!");
		}	
	})
};


exports.removeAll = function(){
	console.log("Clearing collection");
	Notes.remove({}, function (err){
		if (err){
			console.log("error removing all notes:"+err);
		} else {
			console.log(" done clearing");
		}
	});
}





////new stuff june 10, 2013

exports.findAllRooms = function (arrayOfRooms, io) {
	console.log("findAllRooms");
	Notes.find({}, function(err, data){
		for (var i = 0; i< data.length; i++){
			arrayOfRooms.push(data[i].room);
			helper.setUpSockets(data[i].room, io);
		}
	});
}
exports.addNewRoom = function(room){
	console.log("  save new document with room: "+room);

	var note = new Notes( {
		room: room,
		password:""
	});

	note.save(function(err){
		if (err) console.log("FAIL");

	});

}

exports.initLoad = function(room, socket){
	console.log("initLoad for room "+room);
	Notes.find({room:room}, function(err, data){
		if(err) {
			console.log("Error getting data: "+err);
			socket.emit('onLoad', null);
		}
		else {
			var notes = data[0].notes;
			
			var returnNotes = [];
			var maxId = 0;
			for (var i = 0; i<notes.length; i++){
				if (notes[i].id > maxId){
					maxId = notes[i].id;
				}

				var note = {
					id: notes[i].id,
					title: notes[i].title,
					body: notes[i].body
				}
				returnNotes.unshift(note); //put each note onto the returnNotes array
			}
			returnNotes.push(maxId); //put the maxId at the very end
			

			socket.emit('onLoad', returnNotes);
		}
	});

}


exports.saveNote = function(room, data) {
	console.log("saveNote "+room);
	Notes.update({room:room}, {$push:{notes: {id:data.id, title:data.title, body: data.body}}}).exec();
}

exports.updateNote = function(room, data){
	console.log("updateNote "+room+" "+data.id);
	Notes.update({room:room, "notes.id":data.id}
		, {$set: {"notes.$.title":data.title,"notes.$.body":data.body}}).exec();
}


exports.deleteNote = function (room, data){
	console.log("deleteNote "+room+" "+data.id);
	Notes.update({room:room}, {$pull:{notes:{id:data.id}}}).exec();

}





















































