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
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { KOModel } from 'hypnos/lib/models/ko';
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

    coreUuid = ko.observable();
    jid = ko.observable();
    createdAt = ko.observable();
    type = ko.observable();
    partyJid = ko.observable();

    chatName = ko.pureComputed(() => {
        return Strophe.getNodeFromJid(this.jid());
    });

    purge = function() {
        this.getAllMessages().forEach(function(msg, idx, _) {
            msg.delete();
        });
    };

    /* Convenience Methods */

    getUnreadMessages = function() {
        return PersistenceService.findFiltered(Message, function(msg, _) {
            return Strophe.getBareJidFromJid(msg.from) == this.jid() && !msg.read;
        });
    };

    getAllMessages = function() {
        return PersistenceService.findFiltered(Message, function(msg, _) {
            return Strophe.getBareJidFromJid(msg.from) == this.jid();
        }).concat(PersistenceService.findFiltered(Presence, function(msg, _) {
            return Strophe.getBareJidFromJid(msg.from) == this.jid();
        }));
    };

    getRoomMembers = function() {
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