import ko from 'knockout'

import 'bin/knockout-custom-loader'
import 'charactersheet/viewmodels/dm'

import { CharacterManager,
    Notifications } from 'charactersheet/utilities'
import { ImageServiceManager,
    DMCardPublishingService,
    PersistenceService,
    HotkeysService,
    ChatServiceManager } from 'charactersheet/services'
import { Campaign } from 'charactersheet/models/dm'


import template from './index.html'
import overviewTabImage from 'images/tab_icons/bookmarklet.svg'
import encounterTabImage from 'images/tab_icons/treasure-map.svg'
import dmScreenTabImage from 'images/tab_icons/gift-of-knowledge.svg'
import notesTabImage from 'images/tab_icons/quill-ink.svg'
import partyTabImage from 'images/tab_icons/backup.svg'
import chatTabImage from 'images/tab_icons/conversation.svg'


export function DMRootViewModel() {
    var self = this;

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    self.dmCardService = DMCardPublishingService.sharedService();
    self.imageService = ImageServiceManager.sharedService();

    self.overviewTabImage = overviewTabImage;
    self.encounterTabImage = encounterTabImage;
    self.dmScreenTabImage = dmScreenTabImage;
    self.notesTabImage = notesTabImage;
    self.partyTabImage = partyTabImage;
    self.chatTabImage = chatTabImage;

   //UI Methods

    self.playerSummary = ko.pureComputed(function() {
        var key = CharacterManager.activeCharacter().key();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.summary() ? campaign.summary() : '';
    });

    self.playerTitle = ko.pureComputed(function() {
        var key = CharacterManager.activeCharacter().key();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.name() ? campaign.name() : '';
    });

    self.playerAuthor = ko.pureComputed(function() {
        var key = CharacterManager.activeCharacter().key();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.playerName() ? campaign.playerName() : '';
    });

    self.pageTitle = ko.pureComputed(function() {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    // Tab statuses

    self.overviewTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('overview');
    });

    self.encounterTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('encounter');
    });

    self.dmscreenTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('dmscreen');
    });
    self.chatTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('chat');
    });

    self.partyTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('party');
    });

    self.notesTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('notes');
    });

    self.activateOverviewTab = function() {
        self.activeTab('overview');
    };

    self.activateEncounterTab = function() {
        self.activeTab('encounter');
    };

    self.activateDmScreenTab = function() {
        self.activeTab('dmscreen');
    };

    self.activatePartyTab = function() {
        self.activeTab('party');
    };

    self.activateChatTab = function() {
        self.activeTab('chat');
    };

    self.activateNotesTab = function() {
        self.activeTab('notes');
    };

    //Public Methods

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
        Notifications.xmpp.disconnected.add(self._removeCurrentNode);

        HotkeysService.registerHotkey('1', self.activateOverviewTab);
        HotkeysService.registerHotkey('2', self.activateEncounterTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activateNotesTab);
        HotkeysService.registerHotkey('5', self.activatePartyTab);
        HotkeysService.registerHotkey('6', self.activateChatTab);

        self.dmCardService.init();
        self.imageService.init();
    };

    self.unload = function() {
        HotkeysService.flushHotkeys();

        Notifications.xmpp.pubsub.subscribed.remove(self._updateCurrentNode);
        Notifications.xmpp.pubsub.unsubscribed.remove(self._removeCurrentNode);
        Notifications.xmpp.disconnected.remove(self._removeCurrentNode);

        self.dmCardService.deinit();
    };

    //Private Methods

    self._tabIsVisible = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._updateCurrentNode = function(node, success) {
        self.currentPartyNode(node);
    };

    self._removeCurrentNode = function(node, success) {
        self.currentPartyNode(null);
    };

    self.dispose = function() {
        self.unload();
    }
}

ko.components.register('dm-root', {
    viewModel: DMRootViewModel,
    template: template
})
