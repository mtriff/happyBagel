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

exports.findAll = function(){
	console.log("All data from db");
	var test = Notes.find();
	console.log(test);

}