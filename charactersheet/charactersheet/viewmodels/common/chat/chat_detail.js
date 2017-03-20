'use strict';

function ChatDetailViewModel(chatCell) {
    var self = this;

    self.id = chatCell.chatId;
    self.name = chatCell.name;

    self.templateUrl = 'templates/common';
    self.templateName = 'chat.tmpl';

    self._log = [
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

    self.log = ko.observableArray();
    self.message = ko.observable('');

    /* Public Methods */
    self.load = function() {
        var log = self._log.filter(function(msg, idx, _) {
            return msg.chatId == self.id();
        });
        self.log(log);
    };

    self.unload = function() {
        self.save();
    };

    self.save = function() {
//         var chat = PersistenceService.findFirstBy(Chat, 'chatId', self.chatId());
//         if (chat) {
//             chat.name(self.name());
//             chat.chatLocation(self.chatLocation());
//             chat.save();
//         }
    };

    self.delete = function() {
    };

    /* UI Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());

        // Modal will open.
        if (self.openModal()) {
            self._initializeVisibilityVMs();
        }
    };

    self.sendMessage = function() {
        self.message('');
        return false;
    };
}
