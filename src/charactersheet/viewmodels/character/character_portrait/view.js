import { Core, ProfileImage } from 'charactersheet/models/common';
import { Notifications, Utility } from 'charactersheet/utilities';
import { OtherStats, Profile } from 'charactersheet/models/character';
import { CoreManager } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import autoBind from 'auto-bind';
import { defer } from 'lodash';
import ko from 'knockout';
import md5 from 'blueimp-md5';
import template from './view.html';

const GRAVATAR_BASE_URL = 'https://www.gravatar.com/avatar/{}?d=mm';

export class CharacterPortraitViewModel {
    constructor(params) {
        this.loaded = ko.observable(false);
        this.forceCardResize = params.forceCardResize;
        this.flip = params.flip;
        this.subscriptions = [];
        this.core = ko.observable(new Core());
        this.profile = ko.observable(new Profile());
        this.otherStats = ko.observable(new OtherStats());
        this.profileImage = ko.observable(new ProfileImage());
        this.imageHeight = 80;
        this.imageWidth = 80;
        autoBind(this);
    }

    async load() {
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.profile().load({uuid: key});
        await this.otherStats().load({uuid: key});
        await this.profileImage().load({uuid: key});
        this.setUpSubscriptions();
        this.loaded(true);
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.profile().load({uuid: key});
        await this.otherStats().load({uuid: key});
        await this.profileImage().load({uuid: key});
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
        this.subscriptions.push(Notifications.profile.playerName.changed.add(this.coreDidUpdate));
        this.subscriptions.push(Notifications.profile.changed.add(this.profileDidUpdate));
        this.subscriptions.push(Notifications.otherstats.changed.add(this.otherStatsDidUpdate));
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

    getGravatarUrl = (email) => {
        try {
            const hash = md5(email.trim());
            return self.GRAVATAR_BASE_URL.replace('{}', hash);
        } catch(err) {
            return '';
        }
    };

    playerImageSrc = ko.pureComputed(() => {
        switch(this.profileImage().type()) {
        case 'picker':
            return '';//self.selectedDefaultImages()[0] ? self.selectedDefaultImages()[0].image : '';

        case 'url':
            return Utility.string.createDirectDropboxLink(this.profileImage().sourceUrl());

        case 'email':
            return self.getGravatarUrl();
        default:

        }
        return '';
    });

    imageBorderClass = ko.pureComputed(() => {
        const border = this.playerImageSrc().length ? 'no-border' : 'dashed-border';
        const inspired = this.otherStats().inspiration() ? 'image-border-inspired' : '';
        return `${border} ${inspired}`;
    });

}

ko.components.register('character-portrait-view', {
    viewModel: CharacterPortraitViewModel,
    template: template
});
