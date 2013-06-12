happyBagel
==========
Original tutorial:
http://www.netmagazine.com/tutorials/angularjs-collaboration-board-socketio


## How to start

1. Mongodb

"mongod" to start your mongodb to listen for connections

2. start server

"node app.js" or if you have nodemon installed "nodemon app.js"

2a. nodemon

nodemon checks for file changes and restarts the server for you

install globally: sudo npm install -g nodemon

### navagating around mongodb
__connect to happybagel database__
mongo
db
show dbs
use happybagel
__show all collections__
db.getCollectionNames()
__everything is in the collection called 'notes'__
db.notes.find()
__add to the collection__
var entry = { room: "room1", password: "pass1"}
db.notes.save(entry)
db.notes.find()
__example: find id's that are greater than 15__
db.notes.find({id: {'$gt':15}})
__example: update__
db.notes.update({id:15}, title)
db.notes.update({id:15}, {$push: {notes:note}})

note: [{id, title, body}]
db.notes.update({id:5}, {$push:{note: {v1:"23423",v2:1234}}})

__example:delete__
db.notes.remove({room:"someroom"})


































