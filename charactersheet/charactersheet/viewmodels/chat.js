"use strict";

function PartyChatViewModel() {
	var self = this;
	
	self.log = ko.observableArray([]);
	self.message = ko.observable('');
	self._dummy = ko.observable(null);
	self.connected = ko.observable(false);
	
	self.init = function() {
		messenger.subscribe('data', 'chat', self.handleMessage);		
		Notifications.connectionManager.changed.add(function() {
			self._dummy.notifySubscribers();
		});
		Notifications.connectionManager.connected.add(function() {
		    self.connected(true);
		});
		Notifications.connectionManager.disconnected.add(function() {
		    self.connected(false);
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
			var name = PlayerSummary.findBy(key).characterName();
			
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
			
			try {
    			var imageUrl = playerSummaryService.playerSummaries.filter(function(e, i, _) {
	        	    return e.id() === message.fromId();
			    })[0].profileImage();
			    message.profileImageUrl(imageUrl);
			} catch(err) {};
			
			self.log.push(message);
		}
	};
			
	self.clear = function() {
		self.log([]);
	};
	
	//Private Methods
		
	self.markdown = function(text) {
		return markdown.toHTML(text).replace('<p>', '').replace('</p>', '');
	};
};
