"use strict";

function PartyChatViewModel(parent) {
	var self = this;
	
	self.parent = parent;
	self.messenger = self.parent.messenger;
	self.players = self.parent.players;
	self.log = ko.observableArray([]);
	self.message = ko.observable('');
	self.id = null;
	
	self.init = function() {
		self.messenger.subscribe('data', 'chat', self.handleMessage);
		self.players.onPlayerEnters(self.handleNewPlayer);
		self.players.onPlayerLeaves(self.handlePlayerLeft);
		self.id = getKey();
	};
		
	//UI Methods
	
	self.sendMessage = function(formElement) {
		var message = self.message().trim();
		if (message !== '') {
			var msg = new ChatMessage();
			msg.fromId(self.id);
			msg.toId('all');
			msg.from(self.parent.parent.playerTitle());
			msg.to('');
			msg.text(message);
			self.messenger.sendDataMsg(self._mainRoomId(), 'chat', msg.exportValues());
			self.message('');
		}
	};

	self.handleMessage = function(msg) {
		var message = new ChatMessage();
		message.importValues(msg);
		//If the message is to you or the group.
		if (message.toId() === self.id || message.toId().toLowerCase() === 'all') {
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
	
	self._mainRoomId = function() {
		return self.parent.parent.defaultRoomId();
	};
	
	/** 
	 * Returns the list of player names & id that are currently in the room.
	 * TODO: get this information from the players module.
	 */
	self._playersInRoom = function() {
		//return self.parent.
	};
};
