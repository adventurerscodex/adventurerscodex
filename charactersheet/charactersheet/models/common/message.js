'use strict';

/**
An object that represents any possible configuration of an XMPP Message element.
This class also provides the functionality of a DB mapped model for convenience.

This class provides a number of different methods for reasoning about
messages and their contents, as well as serializing/deserializing them.

Messages are given a `messageType` that is generated from their contents based
on a series of rules.

@see messageType for more information.
*/
function Message() {
    var self = this;

    self.ps = PersistenceService.register(Message, self);
    self.mapping = {
        include: ['characterId', 'to', 'from', 'type', 'id', 'body', 'html', 'item', 'dateReceived', 'read']
    };

    /**
     * Every message sent through the chat will have a type that tells
     * the chat interface and the various chat subsystems how to render
     * and route the given chat message.
     */
    self.MESSAGE_TYPES = {
        /**
         * Messages of type CHAT are usually plain-text messages sent to/from
         * other members in the party.
         * These messages are usually displayed along with the user's profile
         * picture and their name in the relevant room.
         *
         * NOTE: These messages MUST not have any additional payload.
         */
        HTML: 'chat',
        /**
         * Messages of type DATA are used to send some form of JSON payload
         * through the chat system to/from a given user.
         *
         * These data messages can optionally contain a plain-text message that
         * the user should be shown in the chat to indicate that a data object
         * has been received.
         *
         * NOTE: It is recommended to include a plain-text message with these messages.
         */
        IMAGE: 'data',
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

    /* Public Methods */

    self.messageType = ko.pureComputed(function() {
        if (self.item()) {
            return self.MESSAGE_TYPES.DATA;
        } else if (self.body() != null || self.html() != null) {
            return self.MESSAGE_TYPES.CHAT;
        } else {
            throw Error('Undefined Message Type');
        }
    });

    /**
     * Returns the given route for data messages,
     * If no route is provided, or if the message is not a
     * data message, the return value is null.
     */
    self.route = ko.pureComputed(function() {
        if (self.messageType() == self.MESSAGE_TYPES.DATA) {
            return self.items().xmlns.split('#')[1];
        }
        return null;
    });

    self.fromUsername = ko.pureComputed(function() {
        if (self.type() == 'groupchat') {
            return Strophe.getResourceFromJid(self.from());
        } else {
            return Strophe.getNodeFromJid(self.from());
        }
    });

    self.clear = function() {
        var values = new Message().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
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
        if (self.dateSent()) {
            dateString = (new Date(self.dateSent())).toDateString();
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
            type: 'chat'
        }).c('body').up().c('html', {
            xmlns: Strophe.NS.HTML
        }, self.html());

        if (self.messageType() == self.MESSAGE_TYPES.DATA) {
            message.c('item', {
                xmlns: item.xmlns
            }, JSONPayload.getElement(item.json, {
                compressed: true,
                compression: 'lz-string'
            }));
        }
        return message.tree();
    };
}


Message.fromTree = function(msg) {
    var item = null;
    if ($(msg).find('item').length > 0) {
        item = {
            xmlns: $(msg).find('item').attr('xmlns'),
            json: JSONPayload($(msg).find('item json'))
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
        item: item,
        dateReceived: (new Date()).getTime()
    });
    return chat;
};
