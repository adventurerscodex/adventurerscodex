import { ChatServiceManager } from 'charactersheet/services/common/account/messaging';
import { Notifications } from 'charactersheet/utilities';
import { PartyStatusViewModel } from 'charactersheet/viewmodels/common/party_status';
import Strophe from 'strophe';
import Should from 'should';
import simple from 'simple-mock';

describe('PartyStatusViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should set up notifications and call update once', function() {
            var vm = new PartyStatusViewModel();

            var spy1 = simple.mock(Notifications.party.joined, 'add');
            var spy2 = simple.mock(Notifications.party.left, 'add');
            var spy3 = simple.mock(Notifications.xmpp.disconnected, 'add');
            var spy4 = simple.mock(Notifications.characterManager.changed, 'add');

            vm.load();
            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
            vm.partyStatus().should.equal('<i>You\'re not connected to a party.</i>')
        });
    });

    describe('_updatePartyStatus', function() {
        it('should set the appropriate party status', function() {
            var vm = new PartyStatusViewModel();

            simple.mock(ChatServiceManager, 'currentPartyNode').returnWith('blah');
            var stropheMock = simple.mock(Strophe, 'getNodeFromJid').returnWith('blah');

            vm._updatePartyStatus('node', true);
            vm.partyStatus().should.equal('<i>You\'re connected to <span class=\"text-info\">blah</span></i>.')
        });

        it('should return immediately', function() {
            var vm = new PartyStatusViewModel();
            vm._updatePartyStatus('node', false);
            Should.not.exist(vm.partyStatus())
        });
    });

    describe('_clearPartyStatus', function() {
        it('should set the appropriate party status', function() {
            var vm = new PartyStatusViewModel();

            vm.partyStatus('hi');
            vm.partyStatus().should.equal('hi');
            vm._clearPartyStatus();
            vm.partyStatus().should.equal('<i>You\'re not connected to a party.</i>')
        });
    });
});
