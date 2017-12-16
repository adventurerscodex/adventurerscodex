import {
    AuthenticationToken,
    ChatRoom
} from 'charactersheet/models/common';
import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    KeyValuePredicate,
    PersistenceService,
    XMPPService
} from 'charactersheet/services/common';
import { PartyManagerViewModel } from 'charactersheet/viewmodels/common/party_manager';
import Should from 'should';
import simple from 'simple-mock';

describe('PartyManagerViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should set up notifications, parties, and check if in a party', function() {
            var vm = new PartyManagerViewModel();

            var spy1 = simple.mock(Notifications.xmpp.connected, 'add');
            var spy2 = simple.mock(Notifications.xmpp.reconnected, 'add');
            var spy3 = simple.mock(Notifications.xmpp.disconnected, 'add');
            var spy4 = simple.mock(Notifications.xmpp.error, 'add');
            var spy5 = simple.mock(Notifications.xmpp.conflict, 'add');
            var spy6 = simple.mock(Notifications.party.joined, 'add');
            var spy7 = simple.mock(Notifications.party.left, 'add');
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);
            simple.mock(ChatServiceManager, 'currentPartyNode').returnWith(null);
            var token = new AuthenticationToken();
            token.isValid(true);
            simple.mock(PersistenceService, 'findAll').returnWith([token]);
            simple.mock(XMPPService, 'connection').returnWith(true);

            vm.load();
            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            spy5.called.should.equal(true);
            spy6.called.should.equal(true);
            spy7.called.should.equal(true);
            vm.createOrJoin().should.equal('create');
            vm.inAParty().should.equal(false);
            vm.loggedIn(true);
        });
    });

    describe('roomJid', function() {
        it('should return the room jid', function() {
            var vm = new PartyManagerViewModel();

            vm.roomId('hi');
            vm.roomId().should.equal('hi');
            var roomName = vm.roomJid();
            roomName.should.equal('hi@chat.adventurerscodex.com');
        });
    });

    describe('roomLink', function() {
        it('should return a room link', function() {
            var vm = new PartyManagerViewModel();

            vm.roomId('hi');
            vm.roomId().should.equal('hi');
            var roomLink = vm.roomLink();
            roomLink.should.equal('https://app.adventurerscodex.com/charactersheet/?party_node=hi');
        });

        it('should return nothing', function() {
            var vm = new PartyManagerViewModel();

            vm.roomId().should.equal('');
            var roomLink = vm.roomLink();
            roomLink.should.equal('');
        });
    });
});
