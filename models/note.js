var Notes = require('../models/Notes');

exports.saving = function(data){ //dir from which to serve files
	console.log("saving: ", data);
	//try to save something in the database
	var note = new Notes( {
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

exports.findAll = function(socket){
	console.log("All data from db");
	Notes.find({}, function(err, data){
		if(err) {
			console.log("Error getting data: "+err);
			socket.emit('onLoad', null);
		}
		else {
			var notes = [];
			var maxId = 0;
			for (var i = 0; i<data.length; i++){
				if (data[i].id > maxId){
					maxId = data[i].id;
				}
				var note = {
					id: data[i].id,
					title: data[i].title,
					body: data[i].body
				}
				notes.unshift(note);
			}
			notes.push(maxId);
			socket.emit('onLoad', notes);
		}
	});

}

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


exports.deleteNote = function (data){
	console.log("deleting note with id "+data.id);
	Notes.remove({id:data.id}, function(err){
		if (err){
			console.log("error deleting one note"+err);
		} else {
			console.log("done deleteing");
		}
	})

}

exports.updateNote = function(data){
	console.log("updating note with id "+data.id);
	Notes.update({id:data.id}, {title:data.title, body:data.body}).exec();
}



