import {
    CharacterManager,
    JSONPayload,
    Utility
} from 'charactersheet/utilities';
import {
    CHAT_MESSAGE_TYPES
} from 'charactersheet/services/common';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Strophe from 'strophe';
import ko from 'knockout';

/**
An object that represents any possible configuration of an XMPP Message element.
This class also provides the functionality of a DB mapped model for convenience.

This class provides a number of different methods for reasoning about
messages and their contents, as well as serializing/deserializing them.

Messages are given a `messageType` that is generated from their contents based
on a series of rules.

@see messageType for more information.
*/
export function Message() {
    var self = this;

    self.ps = PersistenceService.register(Message, self);
    self.mapping = {
        include: ['characterId', 'to', 'from', 'type', 'id', 'body', 'html',
            'invite', 'item', 'subject', 'dateReceived', 'read']
    };

    // Generic Chat Message values
    self.characterId = ko.observable();
    self.type = ko.observable();
    self.to = ko.observable();
    self.from = ko.observable();
    self.id = ko.observable();
    self.dateReceived = ko.observable();
    self.read = ko.observable(false);

    // Type specific values
    self.item = ko.observable();
    self.html = ko.observable();
    self.body = ko.observable();
    self.subject = ko.observable();
    self.invite = ko.observable();

    /* Public Methods */

    self.messageType = function() {
        if (self.subject() || self.invite()) {
            return CHAT_MESSAGE_TYPES.META;
        }
        else if (!self.item() && (self.html() || self.body())) {
            return CHAT_MESSAGE_TYPES.CHAT;
        } else if (self.route() == CHAT_MESSAGE_TYPES.READ_ALOUD) {
            return CHAT_MESSAGE_TYPES.READ_ALOUD;
        } else if (self.route() == CHAT_MESSAGE_TYPES.IMAGE) {
            return CHAT_MESSAGE_TYPES.IMAGE;
        } else if (self.route() == CHAT_MESSAGE_TYPES.FORM) {
            return CHAT_MESSAGE_TYPES.FORM;
        }

        // Should never happen.
        return null;
    };

    self.shortHtml = ko.pureComputed(function() {
        return Utility.string.truncateStringAtLength(self.html(), 100);
    });

    /**
     * Returns the given route for data messages,
     * If no route is provided, or if the message is not a
     * data message, the return value is null.
     */
    self.route = ko.pureComputed(function() {
        if (self.item()) {
            return self.item().xmlns.split('#')[1];
        }
        return null;
    });

    self.fromUsername = ko.pureComputed(function() {
        return Strophe.getResourceFromJid(self.from());
    });

    self.fromBare = ko.pureComputed(function() {
        return Strophe.getBareJidFromJid(self.from());
    });

    self.clear = function() {
        var values = new Message().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
        // Must manually override these imports.
        self.item(values.item);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    /* String Methods */

    self.toText = function() {
        var dateString = '';
        if (self.dateReceived()) {
            dateString = (new Date(self.dateReceived())).toDateString();
        }

        return '**{date}**\n\n{text}'.replace(
            '{date}', dateString
        ).replace(
            '{text}', self.html()
        );
    };

    /* XMPP Methods */

    self.tree = function() {
        var message = $msg({
            to: self.to(),
            from: self.from(),
            id: self.id(),
            type: self.type()
        }).c('body').up().c('html', {
            xmlns: Strophe.NS.HTML
        }).c('body', {} , self.html()).up();

        if (self.item()) {
            message.c('item', {
                xmlns: self.item().xmlns
            }).cnode(JSONPayload.getElement(self.item().json, {
                compressed: true,
                compression: 'lz-string'
            }).node);
        }
        return message.tree();
    };
}


Message.fromTree = function(msg) {
    var item = null;
    if ($(msg).find('item').length > 0) {
        item = {
            xmlns: $(msg).find('item').attr('xmlns'),
            json: JSONPayload.getContents($(msg).find('item json'))
        };
    }

    var chat = new Message();
    chat.importValues({
        characterId: CharacterManager.activeCharacter().key(),
        to: $(msg).attr('to'),
        from: $(msg).attr('from'),
        id: $(msg).attr('id'),
        type: $(msg).attr('type'),
        body: $(msg).find('body').text(),
        html: $(msg).find('html body').text(),
        subject: $(msg).find('subject').text(),
        invite: $(msg).find('invite').length > 0,
        dateReceived: (new Date()).getTime()
    });
    chat.item(item);

    return chat;
};
Message.__name = "Message";

PersistenceService.addToRegistry(Message);
