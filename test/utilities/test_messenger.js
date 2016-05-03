'use strict';

describe('Messenger', function() {
    describe('SendSystemMsg', function() {
        it('sends a system message', function() {
            var mockSend = function(c, t, m) {
                c.should.equal('123');
                t.should.equal('system');
            };
            var m = new Messenger();
            m._send = mockSend;
            m.sendSystemMsg('123', 'test', {});
        });
    });

    describe('SendDataMsg', function() {
        it('sends a data message', function() {
            var mockSend = function(c, t, m) {
                c.should.equal('123');
                t.should.equal('data');
            };
            var m = new Messenger();
            m._send = mockSend;
            m.sendDataMsg('123', 'test', {});
        });
    });

    describe('SendReqMsg', function() {
        it('sends a system message', function() {
            var mockSend = function(c, t, m) {
                c.should.equal('123');
                t.should.equal('req');
            };
            var m = new Messenger();
            m._send = mockSend;
            m.sendReqMsg('somethng.something', '123', 'test', {});
        });
    });

    describe('Join', function() {
        it('joins a room', function() {
            var mockSend = function(c, t, m) {
                c.should.equal('someid');
            };
            var m = new Messenger();
            m._send = mockSend;
            m.join('someid');
        });
    });
    
    describe('Leave', function() {
        it('leaves a room', function() {
            var mockSend = function(c, t, m) {
                c.should.equal('someid');
                t.should.equal('leave');
            };
            var m = new Messenger();
            m._send = mockSend;
            m.leave('someid');
        });
    });

    describe('Create', function() {
        it('creates a room id then joins the room', function() {
            var id = null;
            var mockSend = function(c, t, m) {
                id = c;
            };
            var m = new Messenger();
            m._send = mockSend;
            var _id = m.create();
            id.should.equal(_id);
        });
    });

    describe('OnConnect', function() {
        it('responds to the server connection event', function() {
            var m = new Messenger();
            Should.not.exist(m._connected);
            m._onconnect();
//            m._connected.should.equal(true);
        });
    });
});

