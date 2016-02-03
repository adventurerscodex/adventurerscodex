"use strict";

function PartyChatViewModel() {
	var self = this;
	
	self.log = ko.observableArray([]);
	self.message = ko.observable('');
	self._dummy = ko.observable(null);
	
	self.init = function() {
		messenger.subscribe('data', 'chat', self.handleMessage);
		players.onPlayerEnters(self.handleNewPlayer);
		players.onPlayerLeaves(self.handlePlayerLeft);
		
		Notifications.connectionManager.changed.add(function() {
			self._dummy.notifySubscribers();
		});
	};
	
	self.load = function() {
		var log = ChatMessage.findAllBy(CharacterManager.activeCharacter().key());
		self.log(log);
	};
	
	self.unload = function() {
		self.log().map(function(m, i, _) {
			m.save();
		});
	};
	
	self.connected = ko.computed(function() {
		self._dummy();
		try {
			var key = CharacterManager.activeCharacter().key();
			return ConnectionManager.findBy(key)[0].connected();
		} catch(err) {
			return false;
		};
	});

	self._mainRoomId = ko.computed(function() {
		self._dummy();
		try {
			var key = CharacterManager.activeCharacter().key();
			return ConnectionManager.findBy(key)[0].roomId();
		} catch(err) {
			return false;
		};
	});
		
	//UI Methods
	
	self.sendMessage = function(formElement) {
		var message = self.message().trim();
		if (message !== '') {
			var key = CharacterManager.activeCharacter().key();
			var name = '';
			try {
				name = Profile.findBy(key)[0].characterName();
			} catch(err) {};
			
			var msg = new ChatMessage();
			msg.fromId(key);
			msg.toId('all');
			msg.from(name);
			msg.to('');
			msg.text(message);
			messenger.sendDataMsg(self._mainRoomId(), 'chat', msg.exportValues());
			self.message('');
		}
	};

	self.handleMessage = function(msg) {
		var message = new ChatMessage();
		message.importValues(msg);
		message.characterId(CharacterManager.activeCharacter().key());
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
		
	self.clear = function() {
		self.log().map(function(m, i, _) {
			m.delete();
		});
		self.log([]);
	};
	
	//Private Methods
		
	self.markdown = function(text) {
		return markdown.toHTML(text).replace('<p>', '').replace('</p>', '');
	};
};
