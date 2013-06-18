var app = angular.module('app', []);

app.directive('stickyNote', function(socket) {

	var controller = function($scope) {

		/*
			DELETE
		*/
		$scope.deleteNote = function(id) {
			console.log("Deleting "+id);
			$scope.ondelete({
				id: id
			});
		};

		/*
			UPDATE
		*/
		$scope.updateNote = function(note) {
			socket.emit('updateNote', note);
		};

		socket.on('onNoteUpdated', function(data) {
			if(data.id == $scope.note.id) {
				$scope.note.title = data.title;
				$scope.note.body = data.body;
			}				
		});	
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

//service for wrapping socket.io
app.factory('socket', function($rootScope) {
	var socket = io.connect(window.location.pathname);

	//we can send something to server upon connection
	socket.on('connect', function(){
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

//controller MainCtrl, inject $scope object and socket service
app.controller('MainCtrl', function($scope, socket) {

	$scope.notes = [];
	$scope.id = 0;


	/*
		CREATE
	*/
	$scope.createNote = function(title, body) {
		console.log($scope.title+" + "+$scope.body);
		
		var note = {
			id: $scope.id++,
			title: $scope.title,
			body: $scope.body
		};

		$scope.title='';
		$scope.body='';
		
		$scope.notes.unshift(note);
		socket.emit('createNote', note);
	};

	socket.on('onNoteCreated', function(data) {
		$scope.notes.unshift(data);
	});


	/*
		MISC
	*/
	socket.on('general', function(data) {
		console.log("server says: "+data);
	});


	/*
		LOAD
	*/
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


	/*
		DELETE
	*/
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

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data.id);
	});
	
	/*
		FILTER
	*/
	$scope.filter = function(cmd){
		console.log(" filter("+cmd+")");
		//switch case
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