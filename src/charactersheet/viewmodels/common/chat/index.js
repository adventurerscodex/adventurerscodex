import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, SortService, HotkeysService } from 'charactersheet/services/common';
import { Party, ProfileImage } from 'charactersheet/models/common';
import ko from 'knockout';
import { get } from 'lodash';
import template from './index.html';
import './chat-message';


// The offset at which to show a 'scroll to bottom' button for convenience.
const SCROLL_MIN_OFFSET = 500;


class ChatViewModel extends ViewModel {

    chatId = 'chat-log-main';

    constructor(params) {
        super(params);
        autoBind(this);

        this.isVisible = ko.observable(false);
        this.entities = ko.observableArray([]);
        this.currentMessage = ko.observable('');
        this.pinToBottom = ko.observable(true);
        this.messageHasFocus = ko.observable(false);
        this.hasNewMessages = ko.observable(false);
        this.showScrollToBottomButton = ko.observable(false);
    }

    async load() {
        await super.load();

        setTimeout(() => {
            this.scrollChatToBottomIfNeeded(false);
        }, 500)
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
        this.subscriptions.push(Notifications.party.connected.add(this.partyDidConnect));

        // Close the chat on esc key.
        HotkeysService.registerHotkey('Escape', this.hideChat);
    }

    // UI State

    isConnected = ko.pureComputed(() => (
        PartyService.status() === PartyService.Status.connected
    ));

    shouldShowChat = ko.pureComputed(() => (
        PartyService.status() === PartyService.Status.connected
    ));

    // UI Methods

    toggleIsVisible = () => {
        this.isVisible(!this.isVisible());
        if (this.isVisible()) {
            this.chatDidAppear();
        }
    }

    hideChat = () => {
        this.isVisible(false);
    }

    sendToChat() {
        this.sendGlobal(this.currentMessage());
        this.currentMessage('');
    }

    scrollChatToBottomIfNeeded(animate=true) {
        if (this.pinToBottom()) {
            this.scrollChatToBottom(animate);
        }
    }

    scrollChatToBottom(animate=true) {
        const chatElement = document.getElementById(this.chatId);
        if (animate) {
            $(chatElement).animate({
                scrollTop: chatElement.scrollHeight,
            }, 300);
            this.messageHasFocus(true);
        } else {
            chatElement.scrollTop = chatElement.scrollHeight;
        }
    }

    chatDidAppear() {
        setTimeout(() => {
            this.scrollChatToBottomIfNeeded(false);
            this.messageHasFocus(true);
        }, 300);
    }

    // Chat Methods

    async me() {
        const { uuid, playerName: name } = CoreManager.activeCore();
        const { object: { sourceUrl, gravatarUrl } } = await ProfileImage.ps.read({
            uuid: uuid()
        });
        return {
            name: name(),
            id: uuid(),
            imageUrl: sourceUrl() ? sourceUrl() : gravatarUrl()
        };
    }

    async sendGlobal(message, options={}) {
        PartyService.pushToChatLog(message, null, await this.me(), options);
    }

    async sendWhisper(message, to=[]) {
        PartyService.pushToChatLog(message, to, await this.me(), options);
    }

    // Events

    partyDidChange(party) {
        this.entities(PartyService.getChatLog());
    }

    partyDidConnect(party) {
        PartyService.observeChatLog(this.chatLogDidChange)
    }

    chatLogDidChange = (event) => {
        this.entities(PartyService.getChatLog());
        this.scrollChatToBottomIfNeeded();
        // Show the new message alert if and only if the user can't
        // already see them and the message isn't from them.
        const { uuid: myId } = CoreManager.activeCore();
        const lastMessage = this.entities()[this.entities().length - 1];
        this.hasNewMessages(
            (!this.isVisible() || !this.pinToBottom())
            && lastMessage.from.id !== myId()
        );
        if (this.hasNewMessages()) {
            this.showScrollToBottomButton(false);
        }
    }

    chatDidScroll(event) {
        const chatElement = document.getElementById(this.chatId);
        // Automatically set pinToBottom if the chat is scrolled
        // to the bottom. Otherwise let the chat stay where it is.
        const isAtBottom = (
            chatElement.scrollTop >= (
                chatElement.scrollHeight - chatElement.offsetHeight
            )
        );

        this.pinToBottom(isAtBottom);
        if (isAtBottom) {
            this.hasNewMessages(false);
        }

        const isNearBottom = (
            chatElement.scrollTop >= (
                chatElement.scrollHeight
                - chatElement.offsetHeight
                - SCROLL_MIN_OFFSET
            )
        );
        this.showScrollToBottomButton(!isNearBottom && !this.hasNewMessages());

        return true;
    }
}


ko.components.register('chat', {
    viewModel: ChatViewModel,
    template: template
});
