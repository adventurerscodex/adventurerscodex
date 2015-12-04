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
		var cm = ConnectionManager.findBy(CharacterManager.activeCharacter().key());
		cm.forEach(function(e,i,_) { e.delete(); });
	};
	
	self.load = function() {
		self.connectionManager.characterId(CharacterManager.activeCharacter().key());
	};
	
	self.unload = function() {
 		self.connectionManager.connected(false);
 		self.connectionManager.save();
	};
};
