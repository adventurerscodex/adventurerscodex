"use strict";

function ConnectionManager() {
	var self = this;
	self.ps = PersistenceService.register(ConnectionManager, self);
	
	self.connected = ko.observable(false);
	self.roomId = ko.observable(null);
	
	self.joinRoom = function() {
		var roomId = self.roomId().trim();
		if (roomId !== '') {
			messenger.join(roomId);
		}
		self.connected(true);
		self.save();
		ConnectionManagerSignaler.changed.dispatch();
		ConnectionManagerSignaler.connected.dispatch();
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
			connected: self.connected(),
			roomId: self.roomId()
		};
	};
	
	self.importValues = function(values) {
		self.connected(values.connected);
		self.roomId(values.roomId);
	};

};

ConnectionManager.find = function() {
	return PersistenceService.findOne(ConnectionManager);
};
