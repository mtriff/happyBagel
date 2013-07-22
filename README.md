happyBagel

twitter bootstrap

font awesome

angularJS

express

nodeJS

mongodb


### Up and running

"mongod" will listen for your mongodb connections

"node app.js" or "nodemon app.js" (if you have nodemon installed)

### accessing database

"mongo" 

show dbs

use happybagel

db.notes.find() / db.notes.remove()

## hosting on amazon ec2

./mongod --fork --logpath ~/mongod.log --dbpath /mnt/data/db/


forever start app.js

http://stuffpetedoes.blogspot.ca/2012/07/amazon-ec2-learnings.html