import { Core, ProfileImage } from 'charactersheet/models/common';
import { OtherStats, Profile } from 'charactersheet/models/character';
import { CoreManager } from 'charactersheet/utilities';
import { DELAY } from 'charactersheet/constants';
import { Notifications } from 'charactersheet/utilities';
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
        this.forceCardResize();
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        this.core().importValues(CoreManager.activeCore().exportValues());
        await this.profile().load({uuid: key});
        await this.otherStats().load({uuid: key});
        await this.profileImage().load({uuid: key});
    };

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

}

ko.components.register('character-portrait-view', {
    viewModel: CharacterPortraitViewModel,
    template: template
});
