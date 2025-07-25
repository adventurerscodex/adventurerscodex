import { Core, ProfileImage } from 'charactersheet/models/common';
import { OtherStats, Profile } from 'charactersheet/models/character';
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
        this.background = params.background
        this.flip = params.flip;
        this.subscriptions = [];
        this.core = ko.observable(new Core());
        this.profile = ko.observable(new Profile());
        this.otherStats = ko.observable(new OtherStats());
        this.profileImage = ko.observable(new ProfileImage());
        this.party = ko.observable(PartyService.party);
        this.user = UserServiceManager.sharedService().user;

        this.imageHeight = 80;
        this.imageWidth = 80;
        autoBind(this);
    }

    async load() {
        this.setUpSubscriptions();
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.profile().load({uuid: key});
        await this.otherStats().load({uuid: key});
        await this.profileImage().load({uuid: key});
        this.loaded(true);
        this.forceCardResize();
        this.updateBackground();
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.profile().load({uuid: key});
        await this.otherStats().load({uuid: key});
        await this.profileImage().load({uuid: key});
        this.updateBackground();
    };

    isConnectedToParty = ko.pureComputed(() => !!this.party());

    imageDidUpdate = (image) => {
        this.profileImage().importValues(image.exportValues());
    };

    coreDidUpdate = (core) => {
        this.core().importValues(core.exportValues());
    };

    profileDidUpdate = (profile) => {
        this.profile().importValues(profile.exportValues());
    };

    otherStatsDidUpdate = (otherstats) => {
        this.otherStats().importValues(otherstats.exportValues());
    };

    setUpSubscriptions = () => {
        this.subscriptions.push(Notifications.playerimage.changed.add(this.imageDidUpdate));
        this.subscriptions.push(Notifications.profile.playerName.changed.add(this.coreDidUpdate));
        this.subscriptions.push(Notifications.profile.changed.add(this.profileDidUpdate));
        this.subscriptions.push(Notifications.otherstats.changed.add(this.otherStatsDidUpdate));
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
        const border = this.profileImage().imageUrl().length ? 'no-border' : 'dashed-border';
        const inspired = this.otherStats().inspiration() ? 'image-border-inspired' : '';
        return `${border} ${inspired}`;
    });

    isActivePatron = ko.pureComputed(() => (
        !!this.user() ? this.user().isActivePatron : false
    ))

    canonicalPatreonTier = ko.pureComputed(() => (
        !!this.user() ? this.user().canonicalPatreonTier : false
    ))

    statusIndicatorClass = ko.pureComputed(() => (
        this.isConnectedToParty() ? 'success' : 'failure'
    ));

    updateBackground() {
        this.background(this._headerBackgroundStyle());
    }

    _headerBackgroundStyle() {
        if (!this.party() || !this.party().campaign.headerImageUrl) {
            return;
        }

        return `
          background-image:
            linear-gradient(to bottom, transparent, white),
            url('${this.party().campaign.headerImageUrl}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        `;
    }

    // Events

    partyDidChange() {
        this.party(PartyService.party);
        this.updateBackground();
    }
}

ko.components.register('character-portrait-view', {
    viewModel: CharacterPortraitViewModel,
    template: template
});
