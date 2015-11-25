"use strict";

function ConnectionManagerViewModel() {
	var self = this;
	
	self.messenger = messenger;
	self.roomId = ko.observable('');
	
	self.joinRoom = function() {
		var roomId = self.roomId().trim();
		if (roomId !== '') {
			self.messenger.join(roomId);
			self.parent.parent.defaultRoomId(roomId);
			self.parent.parent.connected(true);	
		}
	};
	
	self.createRoom = function() {
		var roomId = self.messenger.create();
		self.parent.parent.defaultRoomId(roomId);
		self.roomId(roomId);
		self.parent.parent.connected(true);	
	};

};
