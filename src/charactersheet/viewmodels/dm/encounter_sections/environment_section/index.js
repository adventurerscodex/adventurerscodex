import {
    CharacterManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    ImageServiceManager,
    PersistenceService,
    XMPPService
} from 'charactersheet/services/common';
import {
    Environment,
    EnvironmentSection,
    Message
} from 'charactersheet/models/dm';
import Strophe from 'strophe';
import ko from 'knockout';
import sectionIcon from 'images/encounters/night-sky.svg';
import template from './index.html';

export function EnvironmentSectionViewModel(params) {
    var self = this;

    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!ko.unwrap(self.encounter)) { return; }
        return self.encounter().encounterId();
    });

    self.sectionIcon = sectionIcon;

    self.name = ko.observable();
    self.tagline = ko.observable();
    self.visible = ko.observable(false);
    self.environment = ko.observable();

    self.imageUrl = ko.observable();
    self.weather = ko.observable();
    self.terrain = ko.observable();
    self.description = ko.observable('');
    self.isExhibited = ko.observable(false);

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

    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);
        Notifications.exhibit.toggle.add(self._dataHasChanged);

        self.imageUrl.subscribe(self.save);
        self.weather.subscribe(self.save);
        self.terrain.subscribe(self.save);
        self.description.subscribe(self.save);

        self._connectionHasChanged();

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
        Notifications.encounters.changed.remove(self._dataHasChanged);
        Notifications.party.joined.remove(self._connectionHasChanged);
        Notifications.party.left.remove(self._connectionHasChanged);
        Notifications.exhibit.toggle.remove(self._dataHasChanged);
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var environment =  PersistenceService.findByPredicates(Environment, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key,
        ])[0];
        if (!environment) {
            var key = CharacterManager.activeCharacter().key();
            environment = new Environment();
            environment.characterId(key);
            environment.encounterId(self.encounterId());
        }
        environment.imageUrl(self.imageUrl());
        environment.weather(self.weather());
        environment.terrain(self.terrain());
        environment.description(self.description());
        environment.isExhibited(self.isExhibited());
        environment.save();
    };

    self.delete = function() {
        var key = CharacterManager.activeCharacter().key();
        var environment =  PersistenceService.findByPredicates(Environment, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key,
        ])[0];
        if (environment) {
            environment.delete();
        }
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

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var environmentSection =  PersistenceService.findByPredicates(EnvironmentSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key,
        ])[0];
        if (environmentSection) {
            self.name(environmentSection.name());
            self.visible(environmentSection.visible());
            self.tagline(environmentSection.tagline());
        }

        var environment =  PersistenceService.findByPredicates(Environment, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key,
        ])[0];
        if (environment) {
            self.environment(environment);
            self.imageUrl(environment.imageUrl());
            self.weather(environment.weather());
            self.terrain(environment.terrain());
            self.description(environment.description());
            self.isExhibited(environment.isExhibited());
        }

        // If there's no data to show, then prefer the edit tab.
        if (!self.imageUrl() && !self.weather() && !self.terrain() && !self.description()) {
            self.selectEditTab();
        } else {
            self.selectPreviewTab();
        }
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
