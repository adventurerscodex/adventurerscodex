"use strict";

function ConnectionManager() {
	var self = this;
	self.ps = PersistenceService.register(ConnectionManager, self);
	
	self.characterId = ko.observable(null);
	self.connected = ko.observable(false);
	self.roomId = ko.observable(null);
	
	self.joinRoom = function() {
		if (self.roomId() !== null) {
			var roomId = self.roomId().trim();
			messenger.join(roomId);
			self.connected(true);
			self.save();
			ConnectionManagerSignaler.changed.dispatch();
			ConnectionManagerSignaler.connected.dispatch();
		}
	};
	
	self.leaveRoomButton = function() {
	    if (messenger.connected) {
	        messenger.leave(self._mainRoomId);
            self.clear();
	    }
	};
	
	self.createRoom = function() {
		self.roomId(messenger.create());
		self.connected(true);
		self.save();
		ConnectionManagerSignaler.changed.dispatch();
		ConnectionManagerSignaler.connected.dispatch();
	};
	
	self.clear = function() {
		self.connected(false);
		self.roomId(null);
		self.save();
		ConnectionManagerSignaler.changed.dispatch();
		ConnectionManagerSignaler.disconnected.dispatch();
	};

	self.save = function() {
		self.ps.save();
	};
	
	self.delete = function() {
		self.ps.delete();
	};
	
	self.exportValues = function() {
		return {
        	characterId: self.characterId(),
			connected: self.connected(),
			roomId: self.roomId()
		};
	};
	
	self.importValues = function(values) {
    	self.characterId(values.characterId);   	
		self.connected(values.connected);
		self.roomId(values.roomId);
	};

};

ConnectionManager.findBy = function(characterId) {
	return PersistenceService.findAll(ConnectionManager).filter(function(e, i, _) {
		return e.characterId() === characterId;
	});
};
