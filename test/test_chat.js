"use strict";

describe('Chat View Model', function() {
   //Mocks and prebuild vals.
   var msg = { 'to': 'hi', toId: 'hah', from: 'dodo', fromId: 'wooo', text: 'test message' };
		
	describe('Send Message', function() {
		it('should construct a message and send it', function() {
			var f = Profile.find;
			Profile.find = function() {
				return {
					characterName: function() {
						return 'Bob';
					}
				};
			};
			messenger = new Messenger();
			messenger.connect();
	
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; },
				};
			};

			var p = new PartyChatViewModel();
			var text = msg.text;
			p.message(text);
			p.sendMessage();
			msg.text.should.equal(text);
			
			Profile.find = f;
			messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});

	describe('Handle Message', function() {
		it('should add messages to the log if they are to that person or all.', function() {
			var f = Profile.find;
			Profile.find = function() {
				return {
					characterName: function() {
						return 'Bob';
					}
				};
			};
			messenger = new Messenger();
			messenger.connect();
	
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; },
				};
			};

			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			msg.toId = 'all';
			p.handleMessage(msg);
			p.log().length.should.equal(2);			
			msg.toId = 'fred';
			p.handleMessage(msg);
			p.log().length.should.equal(2);			

			Profile.find = f;
			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Clear', function() {
		it('should clear all the messages in the chat.', function() {
			var f = Profile.find;
			Profile.find = function() {
				return {
					characterName: function() {
						return 'Bob';
					}
				};
			};
			var messenger = new Messenger();
			messenger.connect();
	
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; },
				};
			};

			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			p.clear();
			p.log().length.should.equal(0);

			Profile.find = f;
			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var f = Profile.find;
			Profile.find = function() {
				return {
					characterName: function() {
						return 'Bob';
					}
				};
			};
			var messenger = new Messenger();
			messenger.connect();
	
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; },
				};
			};

			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			var e = p.exportValues();
			e.log.length.should.equal(p.log().length);

			Profile.find = f;
			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var f = Profile.find;
			Profile.find = function() {
				return {
					characterName: function() {
						return 'Bob';
					}
				};
			};
			var messenger = new Messenger();
			messenger.connect();
	
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; },
				};
			};

			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			
			var e = p.exportValues();
			e.log.length.should.equal(p.log().length);
			
			var p = new PartyChatViewModel(parent);
			p.importValues(e);
			e.log.length.should.equal(p.log().length);

			Profile.find = f;
			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});
});

