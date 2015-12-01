"use strict";

var ConnectionManagerSignaler = {
	connected: new signals.Signal(),
	disconnected: new signals.Signal(),
	changed: new signals.Signal()
};

function ConnectionManagerViewModel() {
	var self = this;
	
	self.connectionManager = new ConnectionManager();
		
	self.init = function() {
	};
	
	self.load = function() {
		var cm = ConnectionManager.find();
		if (cm) {
			self.connectionManager = cm;
			self.connectionManager.joinRoom();
		}	
	};
	
	self.unload = function() {
// 		self.connectionManager.save();
	};
};
