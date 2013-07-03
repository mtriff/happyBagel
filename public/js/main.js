var app = angular.module('app', []);

//original on stackoverflow: how-can-i-detect-onkeyup-in-angularjs
app.directive('onKeyup', function() {
	//onKeyup is an attribute, returning a function (the link)
    return function(scope, elm, attrs) {      
        
        var sendMessageFn = scope.$eval(attrs.onKeyup);
        //element will bind to key inputs
        elm.bind('keyup', function(evt) {
        	console.log(evt.which);
        	if (evt.which == 13 || evt.which == 27) {
        		//$apply makes sure that angular knows 
            	//we're changing something
            	scope.$apply(function() {
                	sendMessageFn.call(scope, evt.which);
            	});
        	}

        });
    };
});

app.directive('stickyNote', function(socket) {

	var controller = function($scope) {

		/*
			DELETE
			calls the ctrl's deleteNote and gives it the id 
		*/
		$scope.deleteNote = function(id) {
			$scope.ondelete({ 
				id: id
			});
		};
		/*
			EMAIL
		*/

		$scope.emailNote = function (id){
			var title = $("#title_"+id).val();
			var body = $("#"+id).val();
			var myMailTo = ["mailto:",
							"?subject=APPNAME.io"+window.location.pathname+" - "+title,
							"&body="+body].join("\n");
			window.location.href = myMailTo;
		}
		/*
			EXPAND
		*/
		$scope.resizeNote = function(id){
			var note = document.getElementById(id);
			if (note.style.height == "48px") {
				note.style.height = 'auto';
				note.style.overflow = 'hidden';
				var newHeight = (note.scrollHeight > 32 ? note.scrollHeight : 32);
				note.style.height = newHeight.toString() + 'px';
			} else {
				note.style.height = '48px';
				note.style.overflow = 'scroll';
			}
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


	var linker = function(scope, element, attrs) {
		

			// Some DOM initiation to make it nice
			element.hide().fadeIn();
			var child = element.children();
			var close = child[1];



	};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: {
			note: '=', //send in a property on the scope to bind to
			ondelete: '&', //& - so we can call the ctrl's deleteNote
			onresize: '&'
		}
	};
});

//service for wrapping socket.io
app.factory('socket', function($rootScope) {
	var socket = io.connect(window.location.pathname);

	//we can send something to server upon connection
	socket.on('connect', function(){
		console.log(window.location.pathname);
		socket.emit("joinRoom", window.location.pathname);
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

	$scope.userlist = [];
	$scope.notes = [];
	$scope.id = 0;


	/*
		JOIN
	*/
	socket.on('joinRoom', function(data) {
		//store userId
		console.log("joinRoom: you are number "+data);
		socket.username=data;
		var inputName = document.getElementById("user_self");
		inputName.name = data;
		$scope.username = data;

		//update color
		var randColor = '#'+(Math.random().toString(16) + '000000').slice(2, 8);
		$scope.toggleSelectColor(randColor);

		//update name
		var n_match = ntc.name(randColor); //http://chir.ag/projects/ntc/
		socket.emit('chat', {cmd:"name", 
			message: {
				userId: socket.username,
				name: n_match[1]
			}}
		);
	});
	
	$scope.toggleSelectColor = function(data) {
		if (data == "random"){
			data = '#'+(Math.random().toString(16) + '000000').slice(2, 8);
		}
		$scope.userColor=data;

		socket.emit('chat', {cmd:"color", 
			message: {
				userId: socket.username,
				color: $scope.userColor
			}}
		);

	};

	socket.on('updateUserList', function(data){
		for (var i=0;i<data.length;i++){
			if (data[i].id == socket.username){
				$scope.username = data[i].name;
				data.splice(i,1);
				break;
			}
		}
		$scope.userlist = data;
	});


	/*
		LOAD
	*/
	socket.on('onLoad', function(data){
		console.log("--onLoad Data--");
		console.log(data);
		if (data == null){
			console.log("-onLoad failed-");
		} else {
			//grab the max id
			$scope.id = data.pop() + 1;
			$scope.notes = data;
			console.log("-onLoad complete: maxId: "+$scope.id+"-");
		}
	});

	/*
		CHAT
	*/
	

	var addChatMessage = function(message){
		var chatbody = document.getElementById("chatArea_box");
		chatbody.innerHTML += message;
		chatbody.scrollTop = chatbody.scrollHeight;
		$scope.chatMessage = "";
	}

	socket.on('chat', function (data) {
        addChatMessage(data);
    });

	$scope.sendChatMessage = function(key) {
		console.log("sending "+$scope.chatMessage);
		if (key == 27) {
			$scope.chatMessage = "";
		} else if (key == 13){
			var message = '<font color="'+$scope.userColor+'">'+$scope.username+': </font>';
			//parseMessageForSmiley($chatMessage);
			message += $scope.chatMessage;
			message += '<br/>';
			socket.emit('chat', {cmd:"message", message: message });
			addChatMessage(message);
		}

	};
	

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
		DELETE
	*/
	$scope.deleteNote = function(id) {
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
	};

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
	};


});