import ko from 'knockout'
import Strophe from 'strophe'

import 'bin/knockout-custom-loader'

import { Message, Environment, EnvironmentSection } from 'charactersheet/models'
import { PlayerPushModalViewModel } from 'charactersheet/viewmodels/dm'
import { ImageServiceManager,
    PersistenceService,
    ChatServiceManager,
    XMPPService } from 'charactersheet/services/common'
import { Notifications, CharacterManager, Utility } from 'charactersheet/utilities'

import template from './index.html'

export function EnvironmentSectionViewModel(parentEncounter) {
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
    self.isExhibited = ko.observable(false);

    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    // Push to Player

    self.pushModalViewModel = ko.observable();
    self.openPushModal = ko.observable(false);

    self._isConnectedToParty = ko.observable(false);

    //Public Methods

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
            self.isExhibited(environment.isExhibited());
        }

        // If there's no data to show, then prefer the edit tab.
        if (!self.imageUrl() && !self.weather() && !self.terrain() && !self.description()) {
            self.selectEditTab();
        }

        self._connectionHasChanged();
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
        Notifications.encounters.changed.remove(self._dataHasChanged);
        Notifications.party.joined.remove(self._connectionHasChanged);
        Notifications.party.left.remove(self._connectionHasChanged);
        Notifications.exhibit.toggle.remove(self._dataHasChanged);
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
        environment.isExhibited(self.isExhibited());
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

    self.convertedImageLink = ko.pureComputed(function() {
        return Utility.string.createDirectDropboxLink(self.imageUrl());
    });

    /* Push to Player Methods */

    self.shouldShowPushButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.pushModalToPlayerButtonWasPressed = function(environment) {
        self.pushModalViewModel(new PlayerPushModalViewModel(self));
        self.pushModalViewModel().load();
        self.openPushModal(true);
    };

    self.pushModalFinishedClosing = function() {
        self.pushModalViewModel().unload();
        self.pushModalViewModel(null);
        self.openPushModal(false);
    };

    self.pushModalDoneButtonWasClicked = function() {
        var selected = self.pushModalViewModel().selectedPartyMembers();
        var environment = PersistenceService.findFirstBy(Environment, 'encounterId', self.encounterId());

        self.pushEnvironmentToPlayers(environment, selected);
    };

    /**
     * Send the current enviroment as an HTML message
     * to the given player/players.
     */
    self.pushEnvironmentToPlayers = function(environment, players) {
        var chat = ChatServiceManager.sharedService();
        var currentParty = chat.currentPartyNode;
        var xmpp = XMPPService.sharedService();

        players.forEach(function(player, idx, _) {
            var bare = Strophe.getBareJidFromJid(player.jid);
            var nick = chat.getNickForBareJidInParty(bare);

            var message = new Message();
            message.importValues({
                to: currentParty + '/' + nick,
                type: 'chat',
                from: xmpp.connection.jid,
                id: xmpp.connection.getUniqueId(),
                html: environment.toHTML(),
                body: ''
            });

            message.item({
                xmlns: Strophe.NS.JSON + '#image',
                json: environment.toJSON()
            });

            xmpp.connection.send(message.tree());
        });
    };

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
            self.isExhibited(environment.isExhibited());
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
})
