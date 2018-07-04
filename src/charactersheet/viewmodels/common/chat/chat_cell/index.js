import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';

export function ChatCellViewModel(chat) {
    var self = this;

    self.id = chat.jid;
    self.characterId = chat.characterId;
    self._name = chat.name;
    self.badge = ko.observable();
    self.isGroupChat = chat.isGroupChat;
    self._getRoomMembers = chat.getRoomMembers;
    self.isParty = chat.isParty;
    self.members = ko.observableArray([]);

    self.placeholder = 'https://www.gravatar.com/avatar/{}?d=mm';

    self.name = ko.pureComputed(function() {
        return self.members().map(function(member, idx, _) {
            return self._getMemberTemplate(member);
        }).join('');

    });

    self.shouldShowDelete = ko.pureComputed(function() {
        return !self.isParty();
    });

    self.reload = function() {
        self.members(self._getRoomMembers());
    };

    /* View Model Methods */

    self.save = function() {};

    /* Template Rendering Methods */

    self._getMemberTemplate = function(card) {
        var url = (typeof card !== 'string') ?
            Utility.string.createDirectDropboxLink(card.get('imageUrl')[0]) : self.placeholder;
        return ChatCellViewModelMemberTemplate.replace(
            '{card.imageUrl}', url
        );
    };
}


var ChatCellViewModelMemberTemplate = '\
    <img src="{card.imageUrl}" width="40px" height="40px" class="img img-circle" />&nbsp;\
';

ko.components.register('chat-cell', {
    viewModel: ChatCellViewModel,
    template: ChatCellViewModelMemberTemplate
});
