"use strict";

var messenger = new Messenger();
messenger.connect();

describe('Players', function() {	

	messenger._subscriptions = [];
	messenger.subscribe = function(c, t, callback) {
		messenger._subscriptions.push(callback);
	};
	
	messenger._sendMgs = false;
	messenger.sendDataMsg = function(t, ty, m) {
		messenger._sendMgs = true;
	};
	
	ConnectionManager.find = function() {
		return {
			roomId: function() {
				return '123';
			}
		};
	};
	
	describe('Init', function() {
		it('should do basic setup.', function() {
			var players = new Players();
			players.init();
			messenger._subscriptions.length.should.equal(3);
			messenger._sendMgs = false;
			messenger._sendMgs.should.equal(false);
			messenger.sendDataMsg('','','');
			messenger._sendMgs.should.equal(true);			
		});
	});

	describe('Unload', function() {
		it('should do basic teardown.', function() {
			var players = new Players();
			players.init();
			messenger._sendMgs = false;
			messenger._sendMgs.should.equal(false);
			players.unload();
			messenger._sendMgs.should.equal(true);
		});
	});

	describe('Say Hello', function() {
		it('should say hello.', function() {
			messenger._sendMgs = false;
			var players = new Players();
			messenger._sendMgs.should.equal(false);
			players.sayHello();
			messenger._sendMgs.should.equal(true);
		});
	});

	describe('Say Goodbye', function() {
		it('should say goodbye.', function() {
			messenger._sendMgs = false;
			var players = new Players();
			messenger._sendMgs.should.equal(false);
			players.sayGoodBye();
			messenger._sendMgs.should.equal(true);
		});
	});

	describe('HandleHello', function() {
		it('should receive a hello message and add the player to it\'s list.', function() {
			var players = new Players();
			var p = new Player();
			p.name = 'Bob';
			p.id = '12324';
			players.handleHello(p);
			players.inRoom.should.containEql(p);
			var lastPing = players.inRoom[0].lastPing;
			//Add redundant player.
			players.handleHello(p);
			players.inRoom.length.should.equal(1);
			players.inRoom[0].lastPing.should.be.greaterThan(lastPing);
			var p = new Player();
			p.id = '23434';
			p.name = 'Fred';
			players.handleHello(p);
			players.inRoom.length.should.equal(2);
		});
	});

	describe('AlertPlayerEnter', function() {
		it('should receive a message when a player is added to it\'s list.', function() {
			var players = new Players();
			var p = new Player();
			p.name = 'Bob';
			p.id = '12324';
			players.onPlayerEnters(function(player) {
				player.should.deepEqual(p);
			});
			players.handleHello(p);
			players.inRoom.should.containEql(p);
		});
	});

	describe('HandleGoodbye', function() {
		it('should receive a goodbye message and add the player to it\'s list.', function() {
			var players = new Players();
			var p = new Player();
			p.name = 'Bob';
			p.id = '12324';
			players.handleHello(p);
			players.handleGoodBye(p);
			players.inRoom.length.should.equal(0);
		});
	});

	describe('AlertPlayerLeaves', function() {
		it('should receive a message when a player is removed from it\'s list.', function() {
			var players = new Players();
			var p = new Player();
			p.name = 'Bob';
			p.id = '12324';
			players.onPlayerLeaves(function(player) {
				player.should.deepEqual(p);
			});
			players.handleHello(p);
			var p = new Player();
			p.name = 'ewew';
			p.id = '3434';
			players.handleHello(p);
			players.handleGoodBye(p);
		});
	});
});

