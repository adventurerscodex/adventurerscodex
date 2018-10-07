import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';

export class ChatCellViewModel {

    static memberTemplate = (
        '<img src="{card.imageUrl}" width="40px" height="40px" class="img img-circle" />&nbsp;'
    );

    placeholder = 'https://www.gravatar.com/avatar/{}?d=mm';

    constructor(chatRoom) {
        this.chatRoom = chatRoom;
        this.badge = ko.observable();
        this.members = ko.observableArray([]);
    }

    get id() {
        return this.chatRoom.jid;
    }

    get isGroupChat() {
        return true;
    }

    get isParty() {
        return this.chatRoom.partyJid() === null;
    }

    _getRoomMembers() {
        return this.chatRoom.getRoomMembers();
    }

    name = ko.pureComputed(function() {
        if (this.isParty) {
            return 'The Party';
        }

        return this.members().map((member, idx, _) => {
            return this._getMemberTemplate(member);
        }).join('');

    }, this);

    shouldShowDelete = ko.pureComputed(function() {
        return !this.isParty;
    }, this);

    reload = () => {
        this.members(this._getRoomMembers());
    };

    /* View Model Methods */

    save = () => {};

    /* Template Rendering Methods */

    _getMemberTemplate = (card) => {
        var url = (typeof card !== 'string') ?
            Utility.string.createDirectDropboxLink(card.get('imageUrl')[0]) : this.placeholder;
        return this.constructor.memberTemplate.replace(
            '{card.imageUrl}', url
        );
    };
}

ko.components.register('chat-cell', {
    viewModel: ChatCellViewModel,
    template: ChatCellViewModel.memberTemplate
});
