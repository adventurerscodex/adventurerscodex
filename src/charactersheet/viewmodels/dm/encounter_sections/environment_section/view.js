import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import ko from 'knockout';
import { get } from 'lodash';
import template from './view.html';


class EnvironmentViewModel extends ViewModel {

    _isConnectedToParty = ko.observable(!!PartyService.party);

    constructor(params) {
        super(params);
        autoBind(this);
        this.entity = params.entity;
        this.encounter = params.encounter;
        this.flip = params.flip;
        this.fullScreen = params.fullScreen;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    // Actions

    async toggleExhibit() {
        this.entity().isExhibited(!this.entity().isExhibited());
        try {
            await this.entity().ps.save();
        } catch(error) {
            const message = !!error ? error.message : '';
            Notifications.userNotification.dangerNotification.dispatch(
                `Unable to update exhibit. ${message}`,
                'Error'
            );
            this.entity().isExhibited(!this.entity().isExhibited());
        }
        this.markAsExhibited(
            this.entity().isExhibited()
                ? this.entity().exhibitUuid()
                : null
        );
    }

    toggleFullScreen() {
        this.fullScreen(!this.fullScreen());
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.environment.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.environment.index;
        return this.encounter().sections()[index].tagline();
    });

    weatherLabel = ko.pureComputed(() => {
        if (this.entity()) {
            return this.entity().weather() ? this.entity().weather() : 'Unknown';
        }
    });

    terrainLabel = ko.pureComputed(() => {
        if (this.entity()) {
            return this.entity().terrain() ? this.entity().terrain() : 'Unknown';
        }
    });

    shouldShowDividingMarker = ko.pureComputed(() => {
        if (this.entity()) {
            return this.entity().imageUrl() || this.entity().description();
        }
    });

    imageWidth = ko.pureComputed(() => {
        if (this.entity()
            && this.entity().imageUrl()
            && this.entity().description()) {
            return '50%';
        }
        return '';
    });

    shouldShowExhibitButton = ko.pureComputed(() => {
        return this._isConnectedToParty();
    });

    convertedImageLink = ko.pureComputed(() => {
        if (this.entity().imageUrl()) {
            return Utility.string.createDirectDropboxLink(this.entity().imageUrl());
        }
    });

    // Events

    partyDidChange = (party) => {
        this._isConnectedToParty(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        this.markAsExhibited(exhibitUuid);
    };

    // Private

    markAsExhibited = (exhibitUuid) => {
        this.entity().isExhibited(
            this.entity().exhibitUuid() === exhibitUuid
        );
    }
}

ko.components.register('environment-view', {
    viewModel: EnvironmentViewModel,
    template: template
});
