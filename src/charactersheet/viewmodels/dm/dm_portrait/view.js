import { Core, ProfileImage } from 'charactersheet/models/common';
import { Campaign } from 'charactersheet/models/dm';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import { PartyService, UserServiceManager } from 'charactersheet/services';
import autoBind from 'auto-bind';
import { defer } from 'lodash';
import ko from 'knockout';
import template from './view.html';

export class CharacterPortraitViewModel {

    constructor(params) {
        this.loaded = ko.observable(false);
        this.forceCardResize = params.forceCardResize;
        this.flip = params.flip;
        this.subscriptions = [];
        this.core = ko.observable(new Core());
        this.campaign = ko.observable(new Campaign());
        this.profileImage = ko.observable(new ProfileImage());
        this.isConnectedToParty = ko.observable(!!PartyService.party);
        this.user = UserServiceManager.sharedService().user;

        this.imageHeight = 80;
        this.imageWidth = 80;
        autoBind(this);
    }

    async load() {
        this.setUpSubscriptions();
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.campaign().load({uuid: key});
        await this.profileImage().load({uuid: key});
        this.loaded(true);
        this.forceCardResize();
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.campaign().load({uuid: key});
        await this.profileImage().load({uuid: key});
    };

    setUpSubscriptions = () => {
        this.subscriptions.push(Notifications.campaign.playerName.changed.add(this.coreDidUpdate));
        this.subscriptions.push(Notifications.playerimage.changed.add(this.imageDidUpdate));
        this.subscriptions.push(Notifications.campaign.changed.add(this.campaignDidUpdate));
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    disposeOfSubscriptions() {
        const disposeOfDisposable = (disposable) => {
            if (disposable.dispose) {
                disposable.dispose();
            } else if (disposable.detach) {
                disposable.detach();
            }

        };
        this.subscriptions.map((disposable) => defer(disposeOfDisposable, disposable));
        this.subscriptions = [];
    }

    dispose() {
        setTimeout(this.disposeOfSubscriptions, DELAY.DISPOSE);
    }

    imageBorderClass = ko.pureComputed(() => {
        return this.profileImage().imageUrl().length ? 'no-border' : 'dashed-border';
    });

    isActivePatron = ko.pureComputed(() => (
        !!this.user() ? this.user().isActivePatron : false
    ));

    canonicalPatreonTier = ko.pureComputed(() => (
        !!this.user() ? this.user().canonicalPatreonTier : false
    ));

    statusIndicatorClass = ko.pureComputed(() => {
        const status = PartyService.status();
        if (!this.isConnectedToParty()) {
            return 'failure';
        } else if (status !== PartyService.Status.connected) {
            return 'warning';
        } else {
            return 'success';
        }
    });

    timeSinceLabel = ko.pureComputed(() => {
        const createdAt = new Date(this.campaign().createdAt());
        const since = this._daysSince(createdAt);
        const dateCreated = createdAt.toLocaleDateString();
        let msg = '';
        if (since > 0) {
            msg = ` This adventure has been in progress for ${since} days, created on ${dateCreated}.`;
        }
        return msg;
    });

    _daysSince(day) {
        var now = (new Date()).getTime();
        return Math.round((now-day.getTime())/(1000*60*60*24));
    };

    // Events

    partyDidChange() {
        this.isConnectedToParty(!!PartyService.party);
    }

    imageDidUpdate = (image) => {
        this.profileImage().importValues(image.exportValues());
    };

    coreDidUpdate = (core) => {
        this.core().importValues(core.exportValues());
    };

    campaignDidUpdate = (campaign) => {
        this.campaign().importValues(campaign.exportValues());
    };
}

ko.components.register('dm-portrait-view', {
    viewModel: CharacterPortraitViewModel,
    template: template
});
