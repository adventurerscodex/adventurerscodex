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

export function ChatDetailViewModel(params) {
    var self = this;

    self.room = params.room;
    self.members = params.room().members;
    self.isGroupChat = params.room().isGroupChat;
    self._getRoomMembers = params.room()._getRoomMembers;
    self.wasAtBottom = ko.observable(true);

    self.log = ko.observableArray();
    self.message = ko.observable('');

    self._xmppIsConnected = ko.observable(false);

    self.id = ko.pureComputed(function() {
        return self.room().id();
    });

    /* Public Methods */

    self.load = function() {

        self.room.subscribe(self.cleanReload);
        self.cleanReload();

        Notifications.xmpp.connected.add(self._updateStatus);
        Notifications.xmpp.disconnected.add(self._updateStatus);
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
        var chat = PersistenceService.findFirstBy(ChatRoom, 'chatJid', self.id());
        if (!chat) { return; }
        self.members(chat.getRoomMembers());

        var log = self._getRecentItems();
        ko.utils.arrayPushAll(self.log, log);
    };

    self.onitemrender = function() {
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
        var room = PersistenceService.findBy(ChatRoom, 'chatJid', self.id())[0];
        room.getUnreadMessages().forEach(function(chat, idx, _) {
            chat.read(true);
            chat.save();
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
        var last = self.log().length - 1;
        if (last < 0) {
            return 0;
        }
        return self.log()[last].dateReceived();
    };

    self._getRecentItems = function() {
        var latestTime = self._getLatestTimeStamp();
        var key = CoreManager.activeCore().uuid();
        var log = PersistenceService.findFiltered(Message, function(msg, _) {
            return (
                Strophe.getBareJidFromJid(msg.from) == self.id() &&
                msg.dateReceived > latestTime &&
                !msg.subject && !msg.invite
            );
        }).concat(PersistenceService.findFiltered(Presence, function(pres, _) {
            return (
                Strophe.getBareJidFromJid(pres.from) == self.id() &&
                pres.dateReceived > latestTime
            );
        })).sort(function(a, b) {
            return a.dateReceived() - b.dateReceived();
        });
        return log;
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
