import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Environment } from 'charactersheet/models/dm';
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
    self.fullScreen = ko.observable(false);
    self.formIsValid = ko.observable(false);
    self.loaded = ko.observable(false);

    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    self.openPushModal = ko.observable(false);
    self.pushType = ko.observable('image');

    self._isConnectedToParty = ko.observable(false);

    self.load = async function() {
        self.loaded(false);
        Notifications.encounters.changed.add(self._dataHasChanged);

        self._connectionHasChanged();

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });

        await self._dataHasChanged();
        self.loaded(true);
    };

    // Push to Player

    self.toggleExhibit = async () => {
        // TODO
    };

    self.toJSON = function() {
        return { name: 'Environment', url: self.environment().imageUrl() };
    };

    self.save = async () => {
        if (self.dataIsChanging) {
            return;
        }
        const environmentResponse = await self.environment().ps.save();
        self.environment(environmentResponse.object);
    };

    /* UI Methods */

    self.weatherLabel = ko.pureComputed(() => {
        if (self.environment()) {
            return self.environment().weather() ? self.environment().weather() : 'Unknown';
        }
    });

    self.terrainLabel = ko.pureComputed(() => {
        if (self.environment()) {
            return self.environment().terrain() ? self.environment().terrain() : 'Unknown';
        }
    });

    self.shouldShowDividingMarker = ko.pureComputed(() => {
        if (self.environment()) {
            return self.environment().imageUrl() || self.environment().description();
        }
    });

    self.selectPreviewTab = async function() {
        if (self.editTabStatusIsActive()) {
            await self.getEnvironment();
        }
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.previewTabStatus('');
        self.editTabStatus('active');
    };

    self.imageWidth = ko.pureComputed(function() {
        if (self.environment()
            && self.environment().imageUrl()
            && self.environment().description()) {
            return '50%';
        }
        return '';
    });

    self.imageClass = ko.pureComputed(function() {
        if (self.environment()
            && self.environment().imageUrl()
            && self.environment().description()) {
            return 'embedded-image pull-right';
        }
        return 'embedded-image';
    });

    self.editTabStatusIsActive = ko.pureComputed(function() {
        if (self.editTabStatus() === 'active') {
            return true;
        }
        return false;
    });

    self.convertedImageLink = ko.pureComputed(function() {
        if (self.environment()) {
            return Utility.string.createDirectDropboxLink(self.environment().imageUrl());
        }
    });

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    self.saveButton = async () => {
        if (self.formIsValid()) {
            await self.save();
            self.selectPreviewTab();
        }
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

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.save();
        },
        updateHandler: ($element) => {
            self.formIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Environment.validationConstraints
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        if (!self.encounter() || !self.encounter().sections()) {
            return;
        }

        self.dataIsChanging = true;
        var section = self.encounter().sections()[Fixtures.encounter.sections.environment.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());

        await self.getEnvironment();

        // If there's no data to show, then prefer the edit tab.
        if (!self.environment().imageUrl()
            && !self.environment().weather()
            && !self.environment().terrain()
            && !self.environment().description()) {
            self.selectEditTab();
        } else {
            self.previewTabStatus('active');
            self.editTabStatus('');
        }
        self.dataIsChanging = false;
    };

    self.getEnvironment = async () => {
        var coreUuid = CoreManager.activeCore().uuid();
        const environmentResponse = await Environment.ps.read({coreUuid, uuid: self.encounterId()});
        self.environment(environmentResponse.object);
    };

    self._connectionHasChanged = function() {
        // TODO
    };
}

ko.components.register('environment-section', {
    viewModel: EnvironmentSectionViewModel,
    template: template
});
