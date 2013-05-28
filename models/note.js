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
			for (var i = 0; i<data.length; i++){
				var note = {
					id: data[i].id,
					title: data[i].title,
					body: data[i].body
				}
				notes.unshift(note);
			}
			socket.emit('onLoad', notes);
		}
	});

}

exports.removeAll = function(){
	console.log("Clearing collection");
	Notes.remove({}, function (err){
		if (err){
			console.log("error"+err);
		} else {
			console.log(" done clearing");
		}
	});
}
