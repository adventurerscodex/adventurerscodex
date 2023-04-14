import autoBind from 'auto-bind';
import { Notifications } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './chat-message.html';


const MAX_URL_DISPLAY_LENGTH = 40;
const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9+&@#\/%=~_|])/ig;


class ChatMessageViewModel extends ViewModel {

    constructor(params) {
        super(params);

        this.message = ko.observable(params.message);
        this.isOnline = ko.observable(
            PartyService.playerIsOnline(this.message().from.id)
        );
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        const partyDidChange = Notifications.party.changed.add(this.partyDidChange);
        this.subscriptions.push(partyDidChange);
    }

    // UI State

    localizedSentAt = ko.pureComputed(() => (
        (new Date(this.message().createdAt)).toLocaleString([], {
            month: '2-digit',
            year: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    ));

    statusIndicatorClass = ko.pureComputed(() => (
        this.isOnline()
        ? 'success'
        : 'failure'
    ));

    escapedHTML = ko.pureComputed(() => (
        new Option(this.message().message).innerHTML
    ));

    linkifiedHTML = ko.pureComputed(() => (
        this.escapedHTML().replace(urlRegex, (url) => {
            const shortUrl = (
                url.length >= MAX_URL_DISPLAY_LENGTH
                ? `${url.substring(0, MAX_URL_DISPLAY_LENGTH)}...`
                : url
            );
            const isLikelyImage =  /\.(jpg|gif|png|jpeg)$/.test(url);
            const anchor = `
                <a href="${url}" target="_blank">
                    ${shortUrl}&nbsp;<i class="fa fa-external-link"></i>
                </a>
            `;
            if (isLikelyImage) {
                return (`
                    <figure>
                        <figcaption>${anchor}</figcaption>
                        <img src="${url}" loading="lazy" class="chat-image" />
                    </figure>
                `);
            } else {
                return anchor;
            }
        })
    ));

    // Events

    partyDidChange = () => {
        this.isOnline(PartyService.playerIsOnline(this.message().from.id));
    }
}


ko.components.register('chat-message', {
    viewModel: ChatMessageViewModel,
    template: template
});
