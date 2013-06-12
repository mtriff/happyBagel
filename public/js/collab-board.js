var app = angular.module('app', []);

app.directive('stickyNote', function(socket) {

	var controller = function($scope) {
			// Incoming broadcast from others
			socket.on('onNoteUpdated', function(data) {
				// Update if the same note
				if(data.id == $scope.note.id) {
					$scope.note.title = data.title;
					$scope.note.body = data.body;
				}				
			});

			// Outgoing
			$scope.updateNote = function(note) {
				//the other clients need to update the note
				console.log("updating note: "+note.body);
				socket.emit('updateNote', note);
			};

			$scope.deleteNote = function(id) {
				console.log("Deleting "+id);
				$scope.ondelete({
					id: id
				});
			};
		};

	
	return {
		restrict: 'A',
		//link: linker,
		controller: controller,
		scope: {
			note: '=',
			ondelete: '&'
		}
	};
});


//a service that wraps socket.io
app.factory('socket', function($rootScope) {
	var socket = io.connect(window.location.pathname);
	socket.on('connect', function(){
		//we can do something upon connection here.

		//console.log(window.location.pathname);
		//socket.emit("joinRoom", window.location.pathname.substring(1));

	});
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

/* app.controller
we're injecting the $scope object and socket service
*/
app.controller('MainCtrl', function($scope, socket) {

	$scope.notes = [];
	$scope.id = 0;

	socket.on('general', function(data) {
		console.log(data);
	});


	//load document from server
	socket.on('onLoad', function(data){
		console.log(data);
		if (data == null){
			console.log("onLoad complete: no data");
		} else {
			//grab the max id
			$scope.id = data.pop() + 1;
			$scope.notes = data;
			console.log("onLoad complete: maxId: "+$scope.id);
		}
	});



	// listener for actions happening from other clients
	socket.on('onNoteCreated', function(data) {
		$scope.notes.push(data);
	});

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data.id);
	});

	
	//create and push to notes and broadcast note
	$scope.createNote = function(title, body) {
		console.log($scope.title);
		var note = {
			id: $scope.id++,
			title: $scope.title,
			body: $scope.body
		};

		$scope.title='';
		$scope.body='';

		$scope.notes.unshift(note);
		//broadcast to onNoteCreated
		socket.emit('createNote', note);
	};

	//handle and broadcast
	$scope.deleteNote = function(id) {
		console.log("handleDeletedNoted");
		$scope.handleDeletedNoted(id);

		socket.emit('deleteNote', {id: id});
	};

	$scope.handleDeletedNoted = function(id) {
		var oldNotes = $scope.notes,
		newNotes = [];

		angular.forEach(oldNotes, function(note) {
			if(note.id !== id) newNotes.push(note);
		});

		$scope.notes = newNotes;
	}

	$scope.filter = function(cmd){
		console.log(" filter("+cmd+")");
		//switch cas
		switch(cmd) {
			case 'clear':
				console.log("clearing");
				//tell server to delete all notes
				socket.emit("filter", "clear");
				//clear our notes array
				$scope.notes = [];
				break;
			case 'all':
				console.log("displaying all");
				break;
			default:
				console.log("unknown filter");
		}
	}


});