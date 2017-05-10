'use strict';

function ChatModalViewModel(parent) {
    var self = this;

    self.templateUrl = 'templates/common';
    self.templateName = 'chat_modal.tmpl';

    self.parent = parent;
    self.partyMembers = ko.observableArray();
    self.partyMembersToAdd = ko.observableArray();

    self.load = function() {
        self.partyMembers(self.getAllPartyMembers());
    };

    self.unload = function() {

    };

    self.getAllPartyMembers = function() {
        return [{
            name: 'Jim',
            jid: 'jim@text.com',
            image: 'https://s-media-cache-ak0.pinimg.com/564x/67/88/bb/6788bbf5cf1cbf91cebc337dc0ec50fb.jpg'
        }, {
            name: 'Bob',
            jid: 'bob@text.com',
            image: 'https://s-media-cache-ak0.pinimg.com/564x/67/88/bb/6788bbf5cf1cbf91cebc337dc0ec50fb.jpg'
        }, {
            name: 'Joe',
            jid: 'sonicrocketman@adventurerscodex.com',
            image: 'http://www.gravatar.com/avatar/11b074a636e00292c98e3e60f7e16595?size=280'
        }, {
            name: 'Tim',
            jid: 'tim@text.com',
            image: 'https://avatars3.githubusercontent.com/u/7286387?v=3&s=460'
        }];
    };
}
