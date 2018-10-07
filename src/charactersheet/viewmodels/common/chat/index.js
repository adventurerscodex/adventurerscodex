/*eslint no-console:0*/
import {
    CHAT_MESSAGE_TYPES,
    ChatServiceManager,
    KeyValuePredicate,
    OrPredicate,
    PersistenceService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { ChatCellViewModel } from './chat_cell';
import { ChatRoom } from 'charactersheet/models';
import { MasterDetailViewModel } from 'charactersheet/viewmodels/common/master_detail';
import { XMPPService } from 'charactersheet/services/common/account';
import ko from 'knockout';
import template from './index.html';
import uuid from 'node-uuid';

export class ChatViewModel extends MasterDetailViewModel {

    chats = ko.observableArray([]);
    isConnectedToParty = ko.observable(false);

    title = 'Chats';
    shouldDisplayModelOnNewItem = true;

    constructor({ isActive }) {
        super();

        this.isActive = isActive;
    }

    /* View Model Methods */

    didLoad = async () => {
        this._purgeChats();

        await this.reloadData();

        this.selectedCell(this.cells()[0]);
        this.checkForParty();

        // Message Notifications
        Notifications.chat.message.add(this._handleMessageReceived);
        Notifications.chat.room.add(this.reloadData);
        Notifications.chat.member.joined.add(this._userHasJoinedOrLeft);
        Notifications.chat.member.left.add(this._userHasJoinedOrLeft);
        Notifications.party.joined.add(this._didJoinParty);
        Notifications.party.left.add(this._hasLeftParty);
        Notifications.party.players.changed.add(this.reloadData);
    };

    didUnload = () => {

        // Message Notifications
        Notifications.chat.message.remove(this._handleMessageReceived);
        Notifications.chat.room.remove(this.reloadData);
        Notifications.chat.member.joined.remove(this._userHasJoinedOrLeft);
        Notifications.chat.member.left.remove(this._userHasJoinedOrLeft);
        Notifications.party.joined.remove(this._didJoinParty);
        Notifications.party.left.remove(this._hasLeftParty);
        Notifications.party.players.changed.remove(this.reloadData);
    };

    checkForParty = () => {
        const chatService = ChatServiceManager.sharedService();
        this.isConnectedToParty(chatService.currentPartyNode !== null);
    };

    /* List Management Methods */

    /**
     * Create a new chat and add it to the list. It should be auto selected.
     *
     * Note: New rooms are created with the following JID format:
     * <user's chosen room name>.<PARTY_ID>@<MUC_SERVICE>
     */
    addItem = async (invitees) => {
        const name = uuid.v4();
        if (invitees.length === 0) {
            return;
        }

        const chatService = ChatServiceManager.sharedService();
        const jid = name + '@' + MUC_SERVICE;
        const room = await chatService.createRoomAndInvite(jid, invitees);

        await this.reloadData();

        const cellToSelect = this.cells().filter(function(cell, idx, _) {
            return cell.id() === room.jid();
        })[0];
        this.selectedCell(cellToSelect);
    };

    /**
     * Clear the detail view model and reload the list of chats.
     */
    deleteCell = async (cell) => {
        const chatService = ChatServiceManager.sharedService();
        chatService.leave(cell.id(), 'test', console.log);

        cell.chatRoom.purge();
        await cell.chatRoom.ps.delete();

        this.reloadData();
        this.selectedCell(this.cells()[0]);
    };

    selectCell = (cell) => {
        this.updateBadge(cell.chatRoom);
    };

    /* Event Methods */

    getDetailObject = function(cell) {
        return cell;
    };

    modalFinishedOpening = function() {};

    /**
     * Once a modal is closed, if it was closed by clicking done, then create
     * a new room and add the selected users to it.
     */
    modalFinishedClosing = (partyMembersToAdd) => {
        this.modalIsOpen(false);
        if (partyMembersToAdd.length > 0) {
            this.addItem(partyMembersToAdd);
        }
    };

    /**
     * Update the value of the badge for a given room.
     */
    updateBadge = (room) => {
        var cellToBadge = this.cells().filter(function(cell, idx, _) {
            return cell.id() === room.jid();
        })[0];
        if (cellToBadge) {
            cellToBadge.badge(room.getUnreadMessages().length);
        }
    };

    // Cell Methods

    /**
     * Fetch all of the chats for the given character/campaign and
     * convert them into cells.
     */
    reloadData = async () => {
        this.chats(await this._getChats());
        this.cells(this._getChatCells());
    };

    /**
     * Tell each of the existing cells to reload their data.
     * This does NOT reload the list of cells from disk.
     */
    refreshCells = () => {
        return this.cells().forEach(function(cell, idx, _) {
            cell.reload();
        });
    };

    /* Private Methods */

    _getChatCells = () => {
        return this.chats().map(function(chat, idx, _) {
            var cell = new ChatCellViewModel(chat);
            cell.reload();
            return cell;
        });
    };

    _getChats = async () => {
        const coreUuid = CoreManager.activeCore().uuid();
        const chatService = ChatServiceManager.sharedService();
        const currentPartyNode = chatService.currentPartyNode;

        if (!currentPartyNode) {
            return [];
        }

        const { objects: rooms } = await ChatRoom.ps.list({
            coreUuid,
            partyJid: currentPartyNode
        });

        const { objects: parties } = await ChatRoom.ps.list({
            coreUuid,
            jid: currentPartyNode
        });

        const chats = [ ...rooms, ...parties ];
        return chats.sort(function(a,b) {
            var aVal = a.isParty() ? 1 : -1;
            var bVal = b.isParty() ? 1 : -1;

            return bVal - aVal;
        });
    };

    /**
     * Return if the current active room is the same as the provided.
     */
    _isSelectedRoom = (room) => {
        if (!room || !this.selectedCell()) { return false; }
        return this.selectedCell().id() === room.jid();
    };

    /**
     * Given a chat message, if it pertains to a backgrounded room,
     * then badge the icon
     * Regardless, alert the user if needed.
     */
    _handleMessageReceived = async (room, msg, delay, hideTitle) => {
        await this.reloadData();
        var roomIsSelected = this._isSelectedRoom(room);

        // The chat detail model will handle foreground messages. We only need
        // to worry about messages that are for background chats.
        // If the room is in the background and the item isn't delayed:
        // Then badge the icon.
        if (!roomIsSelected && !delay) {
            this.updateBadge(room);
        }

        // If the chat tab isn't the foreground tab, then send a notification.
        const chatTabIsForground = this.isActive() == 'active';
        const notification = Notifications.userNotification.infoNotification;
        if (!chatTabIsForground && !delay && msg.messageType() != CHAT_MESSAGE_TYPES.META) {
            if (!hideTitle) {
                notification.dispatch(msg.shortHtml(), msg.fromUsername());
            } else {
                notification.dispatch(msg.shortHtml());
            }

        }
    };

    _userHasJoinedOrLeft = async (presence) => {
        if (this._isMe(presence.fromUsername())) { return; }

        const coreUuid = CoreManager.activeCore().uuid(),
            jid = presence.fromBare();

        const { objects } = await ChatRoom.ps.list({ coreUuid, jid });

        if (objects[0]) {
            const room = objects[0];
            this._handleMessageReceived(room, presence, false, true);
        }
    };

    _didJoinParty = async () => {
        await this.reloadData();
        this.selectedCell(this.cells()[0]);
        this.checkForParty();
    };

    _hasLeftParty = async () => {
        await this.reloadData();
        this._purgeChats();
        this.checkForParty();
    };

    _isMe = (nick) => {
        var xmpp = XMPPService.sharedService();
        return Strophe.getNodeFromJid(xmpp.connection.jid) === nick;
    };

    _purgeChats = () => {
        // Chat logs are saved server-side.
        this.chats().forEach(function(chat, idx, _) {
            chat.purge();
        });
    };
}

ko.components.register('chat', {
    viewModel: ChatViewModel,
    template: template
});
