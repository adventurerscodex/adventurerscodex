"use strict";

describe('Chat View Model', function() {
   //Mocks and prebuild vals.
   var msg = { 'to': 'hi', toId: 'hah', from: 'dodo', fromId: 'wooo', text: 'test message' };
		
	describe('Send Message', function() {
		it('should construct a message and send it', function() {
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
			
			messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});

	describe('Handle Message', function() {
		it('should add messages to the log if they are to that person or all.', function() {
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

			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Clear', function() {
		it('should clear all the messages in the chat.', function() {
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

			var messenger = new Messenger();
			CharacterManager.activeCharacter = c;
		});
	});
});
