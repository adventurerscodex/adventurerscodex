import {
    ChatServiceManager,
    ImageServiceManager,
    PersistenceService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Environment } from 'charactersheet/models/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import ko from 'knockout';
import sectionIcon from 'images/encounters/night-sky.svg';
import template from './index.html';


export function EnvironmentSectionViewModel(params) {
    var self = this;

    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!ko.unwrap(self.encounter)) { return; }
        return self.encounter().uuid();
    });

    self.sectionIcon = sectionIcon;

    self.name = ko.observable();
    self.tagline = ko.observable();
    self.visible = ko.observable(false);
    self.environment = ko.observable();

    self.dataIsChanging = false;
    self.imageUrl = ko.observable();
    self.weather = ko.observable();
    self.terrain = ko.observable();
    self.description = ko.observable('');
    self.isExhibited = ko.observable(false);
    self.fullScreen = ko.observable(false);

    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    // Push to Player

    self.openPushModal = ko.observable(false);
    self.pushType = ko.observable('image');

    self._isConnectedToParty = ko.observable(false);

    // Public Methods

    self.toggleExhibit = function() {
        var imageService = ImageServiceManager.sharedService();
        if (self.isExhibited()) {
            self.isExhibited(false);
            self.save();
            imageService.clearImage();
        } else {
            imageService.publishImage(self.toJSON());
            imageService.clearExhibitFlag();
            self.isExhibited(true);
            self.save();
            self._dataHasChanged();
        }
    };

    self.toJSON = function() {
        return { name: 'Environment', url: self.imageUrl() };
    };

    self.load = async function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);
        Notifications.exhibit.toggle.add(self._dataHasChanged);

        self._connectionHasChanged();

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        await self._dataHasChanged();

        self.imageUrl.subscribe(self.save);
        self.weather.subscribe(self.save);
        self.terrain.subscribe(self.save);
        self.description.subscribe(self.save);
    };

    self.save = async function() {
        if (self.dataIsChanging) {
            return;
        }
        self.environment().imageUrl(self.imageUrl());
        self.environment().weather(self.weather());
        self.environment().terrain(self.terrain());
        self.environment().description(self.description());
        self.environment().isExhibited(self.isExhibited());
        self.environment().ps.save();
    };

    /* UI Methods */

    self.weatherLabel = ko.pureComputed(function() {
        return self.weather() ? self.weather() : 'Unknown';
    });

    self.terrainLabel = ko.pureComputed(function() {
        return self.terrain() ? self.terrain() : 'Unknown';
    });

    self.shouldShowDividingMarker = ko.pureComputed(function() {
        return self.imageUrl() || self.description();
    });

    self.selectPreviewTab = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.previewTabStatus('');
        self.editTabStatus('active');
    };

    self.imageWidth = ko.pureComputed(function() {
        if (self.imageUrl() && self.description()) {
            return '50%';
        }
        return '';
    });

    self.imageClass = ko.pureComputed(function() {
        if (self.imageUrl() && self.description()) {
            return 'embedded-image pull-right';
        }
        return 'embedded-image';
    });

    self.convertedImageLink = ko.pureComputed(function() {
        return Utility.string.createDirectDropboxLink(self.imageUrl());
    });

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    /* Push to Player Methods */

    self.shouldShowPushButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.pushModalFinishedClosing = function() {
        self.openPushModal(false);
    };

    self.pushModalToPlayerButtonWasPressed = function(mapOrImage) {
        self.openPushModal(true);
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        self.dataIsChanging = true;
        var coreUuid = CoreManager.activeCore().uuid();
        var section = self.encounter().sections()[Fixtures.encounter.sections.environment.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());

        const environmentResponse = await Environment.ps.read({coreUuid, uuid: self.encounterId()});
        self.environment(environmentResponse.object);
        if (self.environment()) {
            self.imageUrl(self.environment().imageUrl());
            self.weather(self.environment().weather());
            self.terrain(self.environment().terrain());
            self.description(self.environment().description());
            self.isExhibited(self.environment().isExhibited());
        }

        // If there's no data to show, then prefer the edit tab.
        if (!self.imageUrl() && !self.weather() && !self.terrain() && !self.description()) {
            self.selectEditTab();
        } else {
            self.selectPreviewTab();
        }
        self.dataIsChanging = false;
    };

    self._connectionHasChanged = function() {
        var chat = ChatServiceManager.sharedService();
        self._isConnectedToParty(chat.currentPartyNode != null);
    };
}

ko.components.register('environment-section', {
    viewModel: EnvironmentSectionViewModel,
    template: template
});
