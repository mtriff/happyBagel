//mongoose provides all the CRUD methods
/*
Notes.create
Notes.update
Notes.remove
Notes.find
*/
var mongoose = require('mongoose');

//set up connection to mongodb on localhost and use 'photo_app' as db
mongoose.connect('mongodb://localhost/happybagel', function(err){
	if (err) throw err;
}); 
/*
var schema = new mongoose.Schema({
	room: String,
	id: Number,
	title: String,
	body: String,
});*/
var schema = new mongoose.Schema({
	room: String,
	password: String,
	chat: [String, String],
	notes: [{ id: Number, title: String, body: String }]
});
module.exports = mongoose.model('Notes', schema);


