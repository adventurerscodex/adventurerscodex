'use strict';

function EnvironmentSectionViewModel(parentEncounter) {
    var self = this;

    self.template = 'environment_section.tmpl';
    self.encounterId = parentEncounter.encounterId;

    self.name = ko.observable();
    self.tagline = ko.observable();
    self.visible = ko.observable(false);

    self.imageUrl = ko.observable();
    self.weather = ko.observable();
    self.terrain = ko.observable();
    self.description = ko.observable('');

    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    //Public Methods

    self.init = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var environmentSection = PersistenceService.findFirstBy(EnvironmentSection, 'encounterId', self.encounterId());
        if (environmentSection) {
            self.name(environmentSection.name());
            self.visible(environmentSection.visible());
            self.tagline(environmentSection.tagline());
        }

        var environment = PersistenceService.findFirstBy(Environment, 'encounterId', self.encounterId());
        if (environment) {
            self.imageUrl(environment.imageUrl());
            self.weather(environment.weather());
            self.terrain(environment.terrain());
            self.description(environment.description());
        }

        // If there's no data to show, then prefer the edit tab.
        if (!self.imageUrl() && !self.weather() && !self.terrain() && !self.description()) {
            self.selectEditTab();
        }
    };

    self.unload = function() {
    };

    self.save = function() {
        var environment = PersistenceService.findFirstBy(Environment, 'encounterId', self.encounterId());
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
        environment.save();
    };

    self.delete = function() {
        var environment = PersistenceService.findFirstBy(Environment, 'encounterId', self.encounterId());
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

    /* Private Methods */

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var environmentSection = PersistenceService.findFirstBy(EnvironmentSection, 'encounterId', self.encounterId());
        if (environmentSection) {
            self.name(environmentSection.name());
            self.visible(environmentSection.visible());
        }

        var environment = PersistenceService.findFirstBy(Environment, 'encounterId', self.encounterId());
        if (environment) {
            self.imageUrl(environment.imageUrl());
            self.weather(environment.weather());
            self.terrain(environment.terrain());
            self.description(environment.description());
        }
    };
}
