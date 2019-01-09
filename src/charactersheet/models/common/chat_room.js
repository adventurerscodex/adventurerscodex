import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { CharacterCardPublishingService } from 'charactersheet/services/common/sync/card_service';
import { ChatServiceManager } from 'charactersheet/services/common/account/messaging/chat_service';
import { DMCardPublishingService } from 'charactersheet/services/common/sync/card_service';
import { KOModel } from 'hypnos/lib/models/ko';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Message } from './message';
import { Presence } from './presence';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import Strophe from 'strophe';
import ko from 'knockout';


export class ChatRoom extends KOModel {
    static __skeys__ = ['core', 'chatRooms'];

    static mapping = {
        include: ['coreUuid']
    };

    static CHAT_TYPES = {
        PARTY: 'party'
    };

    coreUuid = ko.observable();
    jid = ko.observable();
    createdAt = ko.observable();
    type = ko.observable();
    partyJid = ko.observable();

    chatName = ko.pureComputed(() => {
        return Strophe.getNodeFromJid(this.jid());
    });

    isParty = () => (
        this.type === ChatRoom.CHAT_TYPES.PARTY
    )

    isGroupChat = () => ( true );

    purge = function() {
        this.getAllMessages().forEach(function(msg, idx, _) {
            msg.delete();
        });
    };

    /* Convenience Methods */

    getUnreadMessages = () => {
        const jid = this.jid();
        return PersistenceService.findFiltered(Message, (msg, _) => (
            Strophe.getBareJidFromJid(msg.from) === jid && !msg.read
        ));
    };

    getAllMessages = () => {
        return PersistenceService.findFiltered(Message, (msg, _) => {
            return Strophe.getBareJidFromJid(msg.from) == this.jid();
        }).concat(PersistenceService.findFiltered(Presence, (msg, _) => {
            return Strophe.getBareJidFromJid(msg.from) == this.jid();
        }));
    };

    getRoomMembers = () => {
        var jid = this.jid();
        var character = CoreManager.activeCore();
        var chatService = ChatServiceManager.sharedService();
        var occupants = chatService.getOccupantsInRoom(jid);

        // Get the current card service.
        var cardService = null;
        if (character.type.name() == 'character') {
            cardService = CharacterCardPublishingService.sharedService();
        } else {
            cardService = DMCardPublishingService.sharedService();
        }

        var occupantCardsOrNames = occupants.map(function(occupant, idx, _) {
            return cardService.pCards[occupant] ? cardService.pCards[occupant] : occupant;
        });

        return occupantCardsOrNames;
    };
}
