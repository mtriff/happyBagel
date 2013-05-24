var app = angular.module('app', []);

app.directive('stickyNote', function(socket) {
	/*var linker = function(scope, element, attrs) {
			element.draggable({
				stop: function(event, ui) {
					socket.emit('moveNote', {
						id: scope.note.id,
						x: ui.position.left,
						y: ui.position.top
					});
				}
			});

			socket.on('onNoteMoved', function(data) {
				// Update if the same note
				if(data.id == scope.note.id) {
					element.animate({
						left: data.x,
						top: data.y
					});
				}
			});

			// Some DOM initiation to make it nice
			
			element.css('left', '10px');
			element.css('top', '50px');
			element.hide().fadeIn();
			
			var top = (62+126*scope.note.id).toString().concat("px");
			console.log(scope.note.id);
			element.css('left', '10px');
			element.css('top', top);
		};
		*/
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

	/*
	restrict
		restrict directive to a certain type of HTML element
		E (element) or A (attribute) or CSS or comment
	link
		all DOM manipulation code
	controller
		like the main controller
		$scope object we're passing in is specific to the DOM element the directive lives on
	scope:
		read up on isolated scope

	*/
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
	var socket = io.connect();
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

	//Here, call to the database to load an array of the notes, with the form [newestNote, 2ndNewestNote, ..., 2ndOldestNote, OldestNote]
	//set $scope.notes to that array, so that the notes are initialized
	$scope.notes = [];
	console.log("notes created empty");
	$scope.id = 0;

	// take note and push
	socket.on('onNoteCreated', function(data) {
		$scope.notes.push(data);
	});

	//handle as well.
	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data.id);
	});

	//create and push to notes and broadcast note
	$scope.createNote = function(title, body) {
		console.log($scope.title);
		var note = {
			//id: new Date().getTime(),
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
});