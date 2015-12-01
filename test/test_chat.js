"use strict";

describe('Chat View Model', function() {
   //Mocks and prebuild vals.
   var msg = { 'to': 'hi', toId: 'hah', from: 'dodo', fromId: 'wooo', text: 'test message' };

	Profile.find = function() {
		return {
			characterName: function() {
				return 'Bob';
			}
		};
	};
	var messenger = new Messenger();
	messenger.connect();

	describe('Send Message', function() {
		it('should construct a message and send it', function() {
			var p = new PartyChatViewModel();
			var text = msg.text;
			p.message(text);
			p.sendMessage();
			msg.text.should.equal(text);
		});
	});

	describe('Handle Message', function() {
		it('should add messages to the log if they are to that person or all.', function() {
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
		});
	});
	
	describe('Clear', function() {
		it('should clear all the messages in the chat.', function() {
			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			p.clear();
			p.log().length.should.equal(0);
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new PartyChatViewModel();
			p.log().length.should.equal(0);
			msg.toId = p.id;
			p.handleMessage(msg);
			p.log().length.should.equal(1);
			var e = p.exportValues();
			e.log.length.should.equal(p.log().length);
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
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
		});
	});
});

