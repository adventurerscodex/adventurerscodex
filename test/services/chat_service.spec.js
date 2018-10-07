import $ from 'jquery';
import { Notifications } from 'charactersheet/utilities';
import { _ChatService } from 'charactersheet/services/common/account/messaging/chat_service';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';

import Strophe from 'strophe';
import joinedPresence from 'joinedPresence';

describe('The Chat Service', () => {
    it('should set up its connection handlers', () => {
        const xmpp = XMPPService.sharedService().init();

        const service = new _ChatService({});
        expect(service._isListeningForXMPPEvents).toBe(false);

        service.init();

        expect(service._isListeningForXMPPEvents).toBe(true);
        expect(service._handlerTokens.length).toBe(3);

        //Check notifications
        expect(Notifications.xmpp.initialized.getNumListeners()).toBe(1);
        expect(Notifications.xmpp.connected.getNumListeners()).toBe(1);
        expect(Notifications.xmpp.disconnected.getNumListeners()).toBe(1);
        expect(Notifications.coreManager.changing.getNumListeners()).toBe(1);
        expect(Notifications.party.joined.getNumListeners()).toBe(1);
        expect(Notifications.party.left.getNumListeners()).toBe(1);

        // Call the setup again and it shouldn't do anything
        service.init();

        expect(service._isListeningForXMPPEvents).toBe(true);
        expect(service._handlerTokens.length).toBe(3);
    });

    it('should dispatch the Party.Joined when a correct presence is recieved', () => {
        const xmpp = XMPPService.sharedService().init();

        Notifications.party.joined.dispatch = jest.fn();
        Strophe.getNodeFromJid = jest.fn();
        Strophe.getNodeFromJid.mockReturnValueOnce('tester');

        const response = $.parseXML(joinedPresence).documentElement;
        const service = new _ChatService({});
        service._handlePresence(response);

        expect(Notifications.party.joined.dispatch).toHaveBeenCalledTimes(1);
    });
});
