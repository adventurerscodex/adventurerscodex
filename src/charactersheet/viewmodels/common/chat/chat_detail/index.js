import {
    ChatRoom,
    Message,
    Presence
} from 'charactersheet/models/common';
import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    PersistenceService,
    XMPPService
} from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

// For some reason, we thought it would be a good idea to start with the cell,
// not the room... REFACTOR
export function ChatDetailViewModel({ chatCell }) {
    var self = this;

    self._chatCell = chatCell;
    self.chatRoom = ko.pureComputed(() => (
        self._chatCell().chatRoom
    ));
    self.wasAtBottom = ko.observable(true);
    self.members = ko.observableArray([]);

    self.log = ko.observableArray();
    self.message = ko.observable('');

    self._xmppIsConnected = ko.observable(false);

    self.id = ko.pureComputed(function() {
        return self._chatCell().chatRoom.jid();
    });

    self.isGroupChat = () => (
        self.chatRoom().isGroupChat()
    );

    self._getRoomMembers = () => (
        self.chatRoom()._getRoomMembers()
    );

    /* Public Methods */

    self.load = function() {
        self._chatCell.subscribe(self.cleanReload);
        self.cleanReload();

        Notifications.xmpp.connected.add(self._updateStatus);
        Notifications.xmpp.disconnected.add(self._updateStatus);
        Notifications.chat.message.add(self._handleMessageReceived);
        Notifications.chat.room.add(self.reloadData);
        Notifications.chat.member.joined.add(self.reloadData);
        Notifications.chat.member.left.add(self.reloadData);
        Notifications.party.joined.add(self.reloadData);
        Notifications.party.left.add(self.reloadData);
        Notifications.party.players.changed.add(self.reloadData);
    };

    self.dispose = function() {
        Notifications.xmpp.connected.remove(self._updateStatus);
        Notifications.xmpp.disconnected.remove(self._updateStatus);
        Notifications.chat.room.remove(self.reloadData);
        Notifications.chat.message.remove(self._handleMessageReceived);
        Notifications.chat.member.joined.remove(self.reloadData);
        Notifications.chat.member.left.remove(self.reloadData);
        Notifications.party.left.remove(self.reloadData);
        Notifications.party.joined.remove(self.reloadData);
        Notifications.party.players.changed.remove(self.reloadData);
    };

    self.cleanReload = function() {
        self.log([]);
        self._markAllAsRead();
        self.reloadData();
        self._updateStatus();
    };

    self.reloadData = function() {
        self.members(self.chatRoom().getRoomMembers());

        const log = self._getRecentItems();
        ko.utils.arrayPushAll(self.log, log);
    };

    self.onitemrender = function(message) {
        // Hack to scroll the element after it's been loaded and rendered.
        // The old plugin relied on DOM events which fire at the wrong time now.
        // Note: Copies code from ko bottomsUp plugin.
        var element = $('[data-scroll="true"]')[0];
        var isAtBottom = element.scrollHeight - element.scrollTop - 5 <= element.clientHeight;
        if (!isAtBottom && self.wasAtBottom()) {
            self.wasAtBottom(true);
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    };

    /* UI Methods */

    self.name = ko.pureComputed(function() {
        return self.members().map(function(member, idx, _) {
            return self._getMemberTemplate(member);
        }).join('');

    });

    self.messageFieldShouldHaveFocus = ko.observable(true);

    self.sendButtonShouldBeDisabled = ko.pureComputed(function() {
        return !self._xmppIsConnected();
    });

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

    /* Private Methods */

    self._markAllAsRead = function() {
        self.chatRoom().getUnreadMessages().forEach((message, idx, _) => {
            message.read(true);
            message.save();
        });
    };

    self._buildMessage = function() {
        if (self.message().trim().length === 0) {
            return null;
        }

        var xmpp = XMPPService.sharedService();
        var key = CoreManager.activeCore().uuid();

        var message = new Message();
        message.importValues({
            from: xmpp.connection.jid,
            html: self.message(),
            to: self.id(),
            type: 'groupchat',
            id: xmpp.connection.getUniqueId(),
            characterId: key
        });

        return message;
    };

    self._sendMessage = function(message, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.send(message.tree());
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
            var jid = card;
            return ChatDetailViewModelMemberTemplate.replace(
                '{card.image}', 'https://www.gravatar.com/avatar/null?d=mm'
            ).replace(
                '{card.name}', Strophe.getNodeFromJid(jid)
            );
        } else {
            return ChatDetailViewModelMemberTemplate.replace(
                '{card.image}', Utility.string.createDirectDropboxLink(card.get('imageUrl')[0])
            ).replace(
                '{card.name}', card.get('name')[0]
            );
        }
    };

    self._getLatestTimeStamp = function() {
        const last = self.log().length - 1;
        if (last < 0) {
            return 0;
        }
        return self.log()[last].dateReceived();
    };

    self._getRecentItems = function() {
        const latestTime = self._getLatestTimeStamp();
        const key = CoreManager.activeCore().uuid();
        const log = PersistenceService.findFiltered(Message, (msg, _) => (
            Strophe.getBareJidFromJid(msg.from) === self.id() &&
            msg.dateReceived > latestTime &&
            !msg.subject && !msg.invite
        )).concat(PersistenceService.findFiltered(Presence, (pres, _) => (
            Strophe.getBareJidFromJid(pres.from) === self.id() &&
            pres.dateReceived > latestTime
        )));

        return log.sort((a, b) => {
            return a.dateReceived() - b.dateReceived()
        });
    };

    self._handleMessageReceived = function (room, msg, delay, hideTitle) {
        if (room.jid() !== self.chatRoom().jid()) {
            // This message is for a different room, we don't care.
            return;
        }

        self.reloadData();
    };
}


var ChatDetailViewModelMemberTemplate = '\
    <div class="col-md-2 col-xs-3 text-center col-padded">\
        <img src="{card.image}" width="60" height="60" \
            class="img img-circle img-padded" /><br />\
        <small class="text-lightgray">{card.name}</small>\
    </div>\
';

ko.components.register('chat-detail', {
    viewModel: ChatDetailViewModel,
    template: template
});
