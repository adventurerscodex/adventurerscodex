'use strict';

function ChatDetailViewModel(chatCell, parent) {
    var self = this;

    self.id = chatCell.id;
    self.members = chatCell.members;
    self.isGroupChat = chatCell.isGroupChat;
    self._getRoomMembers = chatCell._getRoomMembers;
    self.parent = parent;

    self.templateUrl = 'templates/common';
    self.templateName = 'chat.tmpl';

    self.log = ko.observableArray();
    self.message = ko.observable('');

    self._xmppIsConnected = ko.observable(false);

    /* Public Methods */

    self.load = function() {
        self.reloadData();
        self._markAllAsRead();
        self.updateBadge();
        self._updateStatus();

        Notifications.xmpp.connected.add(self._updateStatus);
        Notifications.xmpp.disconnected.add(self._updateStatus);
    };

    self.unload = function() {
        Notifications.xmpp.connected.remove(self._updateStatus);
        Notifications.xmpp.disconnected.remove(self._updateStatus);
    };

    self.save = function() {};

    self.delete = function() {
        var chat = PersistenceService.findFirstBy(ChatRoom, 'chatId', self.id());
        if (chat) {
            chat.purge();
            chat.delete();
        }
    };

    self.reloadData = function() {
        var key = CharacterManager.activeCharacter().key();
        var log = PersistenceService.findByPredicates(ChatMessage, [
            new OrPredicate([
                new KeyValuePredicate('chatId', self.id())
            ])
        ]);

        self.log(log);
    };

    self.updateBadge = function() {
        var room = PersistenceService.findBy(ChatRoom, 'chatId', self.id())[0];
        self.parent.updateBadge(room);
    };

    /* UI Methods */


    self.name = ko.pureComputed(function() {
        return self.members().map(function(member, idx, _) {
            return self._getMemberTemplate(member);
        }).join('');

    });

    self.fromLabel = function(msg) {
        var card = msg.getCard();
        if (!card) {
            return msg.from();
        }
        return card.get('name') + ' (' + msg.from() + ')';
    };

    self.messageFieldShouldHaveFocus = ko.observable(true);

    self.sendButtonShouldBeDisabled = ko.pureComputed(function() {
        return !self._xmppIsConnected();
    });

    self.shouldShowSaveToChatButton = ko.pureComputed(function() {
        var key = CharacterManager.activeCharacter().playerType().key;
        return key == PlayerTypes.characterPlayerType.key;
    });

    self.toggleModal = function() {
        self.parent.modalIsOpen(!self.parent.modalIsOpen());

        // Modal will open.
        if (self.parent.modalIsOpen()) {
            //todo
        }
    };

    self.sendMessage = function() {
        var message = self._buildMessage();

        if (!message) { return; }
        self._sendMessage(message, function() {
            self.log.push(message);
        }, function() {
            message.failed(true);
            self.log.push(message);
        });

        if (!self.isGroupChat()) {
            // Add the message to the log. Group chat's will add
            // them when echoed back.
            message.read(true);
            message.save();
            self.log.push(message);
        }

        self.message('');

        return false;
    };

    self.saveToNotes = function(message) {
        var note = PersistenceService.findFirstBy(Note, 'isSavedChatNotes', true);
        if (!note) {
            var key = CharacterManager.activeCharacter().key();
            note = new Note();
            note.characterId(key);
            note.text('# Saved from Chat');
            note.isSavedChatNotes(true);
        }
        note.text(note.text() + '\n\n' + message.toText());
        note.save();

        Notifications.notes.changed.dispatch();
        Notifications.userNotification.successNotification.dispatch('Saved to Notes.');
    };

    /* Private Methods */

    self._markAllAsRead = function() {
        var key = CharacterManager.activeCharacter().key();
        var log = PersistenceService.findByPredicates(ChatMessage, [
            new OrPredicate([
                new KeyValuePredicate('chatId', self.id())
            ]),
            new KeyValuePredicate('read', false)
        ]);

        log.forEach(function(chat, idx, _) {
            chat.read(true);
            chat.save();
        });
    };

    self._buildMessage = function() {
        if (self.message().trim().length === 0) {
            return null;
        }

        var xmpp = XMPPService.sharedService();
        var key = CharacterManager.activeCharacter().key();

        var message = new ChatMessage();
        message.importValues({
            from: xmpp.connection.jid,
            message: self.message(),
            to: self.id(),
            id: xmpp.connection.getUniqueId(),
            chatId: self.id(),
            characterId: key
        });

        return message;
    };

    self._sendMessage = function(message, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        if (self.isGroupChat()) {
            var id = xmpp.connection.getUniqueId();
            xmpp.connection.muc.groupchat(message.to(), null, message.message(), id);
        } else {
            xmpp.connection.send(message.tree());
        }
        // Actually send the messages.
        xmpp.connection.flush();
    };

    self._updateStatus = function() {
        // Let self know things are good to go.
        var xmpp = XMPPService.sharedService();
        if (xmpp.connection.connected) {
            self._xmppIsConnected(true);
        } else {
            self._xmppIsConnected(false);
        }
    };

    self._getMemberTemplate = function(card) {
        if (typeof card == 'string') {
            return card;
        } else {
            return ChatDetailViewModelMemberTemplate.replace(
                '{card.image}', card.get('imageUrl')[0]
            ).replace(
                '{card.name}', card.get('name')[0]
            );
        }
    };
}


var ChatDetailViewModelMemberTemplate = '\
    <div class="col-md-2 col-xs-3 text-center col-padded">\
        <img src="{card.image}" width="60" height="60" \
            class="img img-circle img-padded" /><br />\
        <small class="text-muted">{card.name}</small>\
    </div>\
'
