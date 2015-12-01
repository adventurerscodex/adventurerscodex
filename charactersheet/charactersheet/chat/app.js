"use strict";

function PartyChatViewModel() {
	var self = this;
	
	self.log = ko.observableArray([]);
	self.message = ko.observable('');
	self.id = null;
	self._dummy = ko.observable(null);
	
	self.init = function() {
		messenger.subscribe('data', 'chat', self.handleMessage);
		players.onPlayerEnters(self.handleNewPlayer);
		players.onPlayerLeaves(self.handlePlayerLeft);
		self.id = CharacterManager.active;
		
		ConnectionManagerSignaler.changed.add(function() {
			self._dummy.notifySubscribers();
		});
	};
	
	self.load = function() {
	};
	
	self.unload = function() {
	};
	
	self.connected = ko.computed(function() {
		self._dummy();
		try {
			return ConnectionManager.find().connected();
		} catch(err) {};
	});

	self._mainRoomId = ko.computed(function() {
		self._dummy();
		try {
			return ConnectionManager.find().roomId();
		} catch(err) {};
	});
		
	//UI Methods
	
	self.sendMessage = function(formElement) {
		var message = self.message().trim();
		if (message !== '') {
			var msg = new ChatMessage();
			msg.fromId(self.id);
			msg.toId('all');
			msg.from(Profile.find().characterName());
			msg.to('');
			msg.text(message);
			messenger.sendDataMsg(self._mainRoomId(), 'chat', msg.exportValues());
			self.message('');
		}
	};

	self.handleMessage = function(msg) {
		var message = new ChatMessage();
		message.importValues(msg);
		//If the message is to you or the group.
		if (message.toId() === self.id || message.toId().toLowerCase() === 'all') {
			message.text(self.markdown(message.text()));
			self.log.push(message);
		}
	};
	
	self.handleNewPlayer = function(player) {
		var message = new ChatMessage();
		message.text('<i><small>' + player.name + ' has entered the room.</small></i>');
		self.log.push(message);
	};

	self.handlePlayerLeft = function(player) {
		var message = new ChatMessage();
		message.text('<i><small>' + player.name + ' has left the room.</small></i>');
		self.log.push(message);
	};
	
	self.importValues = function(values) {
		var log = $.map(values.log, function(e) { 
			var msg = new ChatMessage();
			msg.importValues(e); 
			return msg;
		});
		self.log(log);
	};
	
	self.exportValues = function() {
		var log = $.map(self.log(), function(e) { return e.exportValues(); });
		return {
			log: log
		};
	};
	
	self.clear = function() {
		self.log([]);
	};
	
	//Private Methods
		
	/** 
	 * Returns the list of player names & id that are currently in the room.
	 * TODO: get this information from the players module.
	 */
	self._playersInRoom = function() {
		//return self.parent.
	};

	self.markdown = function(text) {
		return markdown.toHTML(text).replace('<p>', '').replace('</p>', '');
	};
};
