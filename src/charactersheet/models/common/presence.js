import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { CHAT_MESSAGE_TYPES, STATUS_CODES } from 'charactersheet/services/common/account/messaging/chat_message_types';
import { ChatServiceManager } from 'charactersheet/services/common/account/messaging/chat_service';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Strophe from 'strophe';
import ko from 'knockout';


/**
An object representation of an XMPP presence message.

This class provides a number of different convenience methods for routing, and
reasoning about presence messages.
*/
export class Presence {

    static __name = 'Presence';

    static fromTree(element) {
        const presence = new Presence();

        presence.importValues({
            hasParticipantRole: $(element).find('item[role="participant"]').length > 0,
            hasModeratorRole: $(element).find('item[role="moderator"]').length > 0,
            hasNoneRole: $(element).find('item[role="none"]').length > 0,
            from: $(element).attr('from'),
            hasError: $(element).find('error').length > 0,
            dateReceived: (new Date()).getTime()
        });

        presence.statuses = ko.observableArray(
            $(element).find('status').map((i, e) => {
                const codeValue = $(e).attr('code');
                return parseInt(codeValue);
            })
        );

        return presence;
    }

    ps = PersistenceService.register(Presence, this);
    mapping = {
        include: ['hasParticipantRole', 'hasModeratorRole', 'hasNoneRole', 'from', 'hasError', 'dateReceived']
    };

    coreUuid = ko.observable();
    messageType = ko.observable(CHAT_MESSAGE_TYPES.SYSTEM);

    // Model Methods

    importValues = (values) => {
        const mapping = ko.mapping.autoignore(this, this.mapping);
        ko.mapping.fromJS(values, mapping, this);
    };

    exportValues = () => {
        const mapping = ko.mapping.autoignore(this, this.mapping);
        return ko.mapping.toJS(this, mapping);
    };

    save = () => {
        this.ps.save();
    };

    delete = () => {
        this.ps.delete();
    };

    // From Methods

    /**
     * This method returns the RESOURCE from the JID because MUC JIDs are
     * of the form <node>@<service>/<resource> where the resource is the
     * member's username.
     */
    fromUsername = () => {
        return Strophe.getResourceFromJid(this.from());
    };

    fromBare = () => {
        return Strophe.getBareJidFromJid(this.from());
    };

    // Party/Room Methods

    regardsCurrentParty = () => {
        const chat = ChatServiceManager.sharedService();
        return this.fromBare() === Strophe.getBareJidFromJid(chat.currentPartyNode);
    };

    regardsActiveRoom = () =>  {
        const chat = ChatServiceManager.sharedService();

        // We've joined a room, but there are no active rooms set yet.
        if (chat.getAllRooms().length == 0) {
            return true;
        }
        return chat.getAllRooms().some((jid, idx, _) => {
            return this.fromBare() === Strophe.getBareJidFromJid(jid);
        });
    };

    regardsJoiningRoom = () => {
        return this.regardsActiveRoom() && (
            this.hasParticipantRole() || this.hasModeratorRole()
        );
    };

    regardsLeavingRoom = () => {
        return this.hasNoneRole();
    };

    regardsLeavingParty = () => {
        return this.hasNoneRole() && this.regardsCurrentParty();
    };

    html = ko.pureComputed(() => {
        if (this.regardsJoiningRoom()) {
            return this.fromUsername() + ' has joined the room.';
        } else if (this.regardsLeavingRoom()) {
            return this.fromUsername() + ' has left the room.';
        } else {
            return 'something else has happened.';
        }
    });

    shortHtml = this.html;
}

PersistenceService.addToRegistry(Presence);
