"use strict";

describe('Players', function() {
	var parent = {
		parent: {
			defaultRoomId: function() { return '12'; },
			characterTabViewModel: function() {  
				return {
					profileViewModel: function() {
						return { 
							profile: function() {
								return {
									characterName: function() {
										return 'hi';
								}
							};
						};
					},
				};
			},
		},
		messenger: new Messenger()
	};
	
	parent.messenger._subscriptions = [];
	parent.messenger.subscribe = function(c, t, callback) {
		parent.messenger._subscriptions.push(callback);
	};
	
	parent.messenger._sendMgs = false;
	parent.messenger.sendDataMsg = function(t, ty, m) {
		parent.messenger._sendMgs = true;
	};
	
	describe('Init', function() {
		it('should do basic setup.', function() {
			var players = new Players(parent);
			players.init();
			parent.messenger._subscriptions.length.should.equal(3);
			parent.messenger._sendMgs.should.equal(false);
		});
	});

	describe('Unload', function() {
		it('should do basic teardown.', function() {
			var players = new Players(parent);
			players.init();
			parent.messenger._sendMgs.should.equal(false);
			players.unload();
			parent.messenger._sendMgs.should.equal(true);
		});
	});

	describe('Say Hello', function() {
		it('should say hello.', function() {
			parent.messenger._sendMgs = false;
			var players = new Players(parent);
			parent.messenger._sendMgs.should.equal(false);
			players.sayHello();
			parent.messenger._sendMgs.should.equal(true);
		});
	});

	describe('Say Goodbye', function() {
		it('should say goodbye.', function() {
			parent.messenger._sendMgs = false;
			var players = new Players(parent);
			parent.messenger._sendMgs.should.equal(false);
			players.sayGoodBye();
			parent.messenger._sendMgs.should.equal(true);
		});
	});

	describe('HandleHello', function() {
		it('should receive a hello message and add the player to it\'s list.', function() {
			var players = new Players(parent);
			var p = new Player();
			p.name = 'Bob';
			p.id = '12324';
			players.handleHello(p);
			players.inRoom.should.containEql(p);
			var lastPing = players.inRoom[0].lastPing;
			//Add redundant player.
			players.handleHello(p);
			players.inRoom.length.should.equal(1);
			players.inRoom[0].lastPing.should.be.above(lastPing);
			var p = new Player();
			p.id = '23434';
			p.name = 'Fred';
			players.handleHello(p);
			players.inRoom.length.should.equal(2);
		});
	});

	describe('AlertPlayerEnter', function() {
		it('should receive a message when a player is added to it\'s list.', function() {
			var players = new Players(parent);
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
			var players = new Players(parent);
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
			var players = new Players(parent);
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

