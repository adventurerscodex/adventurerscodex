"use strict";

var roomId = '123344';
var cmParent = function () {
	return {
		parent: { 
			defaultRoomId: ko.observable(''), 
			connected: ko.observable(false) 
		},
		messenger: { join: function(roomId) {}, create: function() { return roomId; } }
	};
};

describe('Connection Manager View Model', function() {
	describe('Join Room', function() {
		it('should join the given room and set the connection flag', function() {
			var p = new ConnectionManagerViewModel(new cmParent());
			p.roomId(roomId);
			p.joinRoom();
			p.roomId().should.equal(roomId);
			p.parent.parent.connected().should.equal(true);
			p.parent.parent.defaultRoomId().should.equal(roomId);
			
			//Try to join a blank room.			
			var p = new ConnectionManagerViewModel(new cmParent());
			p.roomId('');
			p.joinRoom();
			p.roomId().should.equal('');
			p.parent.parent.connected().should.equal(false);
			p.parent.parent.defaultRoomId().should.equal('');
		});
	});

	describe('Create Room', function() {
		it('should create the given room and set the connection flag', function() {
			var p = new ConnectionManagerViewModel(new cmParent());
			p.createRoom();
			p.roomId().should.equal(roomId);
			p.parent.parent.connected().should.equal(true);
			p.parent.parent.defaultRoomId().should.equal(roomId);
		});
	});
});

