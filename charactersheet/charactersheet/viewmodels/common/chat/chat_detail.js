'use strict';

function ChatDetailViewModel(chatCell) {
    var self = this;

    self.id = chatCell.chatId;
    self.name = chatCell.name;

    self.templateUrl = 'templates/common';
    self.templateName = 'chat.tmpl';

    self.log = ko.observableArray();
    self.message = ko.observable('');

    /* Public Methods */
    self.load = function() {
        var log = Chat_debuglog.filter(function(msg, idx, _) {
            return msg.chatId == self.id();
        }).map(function(msg, idx, _) {
            var chat = new ChatMessage();
            chat.importValues(msg);
            return chat;
        });
        self.log(log);
    };

    self.unload = function() {
        self.save();
    };

    self.save = function() {
    };

    self.delete = function() {
    };

    /* UI Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());

        // Modal will open.
        if (self.openModal()) {
        }
    };

    self.sendMessage = function() {
        var message = new ChatMessage();
        message.from(self._from());
        message.fromImage(self._fromImage());
        message.message(self.message());
        message.to(self.id());

        self._sendMessage(message, function() {
            self.log.push(message);
        }, function() {
            message.failed(true);
            self.log.push(message)
        });

        self.message('');
        return false;
    };

    /* Private Methods */

    self._from = function() {
        return 'Kelan (Brian)';
    };

    self._fromImage = function() {
        return 'http://en.gravatar.com/userimage/25914696/2d4cb9d29079c80a036ccebbef0f3db8.jpg?size=200';
    };

    self._sendMessage = function(chatMessage, onsuccess, onerror) {
        onsuccess();
        //TODO
    };
}

//DEBUG
var Chat_debuglog = [
    {
        from: 'Kelan (Brian)',
        fromImage: 'http://en.gravatar.com/userimage/25914696/2d4cb9d29079c80a036ccebbef0f3db8.jpg?size=200',
        message: 'Hey everyone!',
        chatId: 'hi'
    },
    {
        from: 'Thoros (Jim)',
        fromImage: 'http://en.gravatar.com/userimage/25914696/f2562dfe5ea8a95c67d924c9d47e405a.jpg?size=200',
        message: 'Hey @Kelan!  🎉 🎉 🎉',
        chatId: 'hi'
    },
    {
        from: 'Wind (Nathaniel)',
        fromImage: 'https://avatars1.githubusercontent.com/u/7286387?v=3&s=400',
        message: 'What did you see on the wall?',
        chatId: 'hiwq'
    },
    {
        from: 'Kelan (Brian)',
        fromImage: 'http://en.gravatar.com/userimage/25914696/2d4cb9d29079c80a036ccebbef0f3db8.jpg?size=200',
        message: 'nothing.. couldn\'t read',
        chatId: 'hiwq'
    },
];



