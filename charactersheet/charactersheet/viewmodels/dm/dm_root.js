'use strict';

function DMRootViewModel() {
    var self = this;

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    //Player Child View Models
    self.playerImageViewModel = ko.observable(new PlayerImageViewModel());
    self.campaignTabViewModel = ko.observable(new CampaignTabViewModel());
    self.encounterTabViewModel = ko.observable(new EncounterTabViewModel());
    self.partyTabViewModel = ko.observable(new PartyTabViewModel());
    self.chatTabViewModel = ko.observable(new ChatTabViewModel());
    // TODO: Add

    //Tooltips
    // TODO: Add

    //Tab Properties
    // TODO: Add

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

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        HotkeysService.registerHotkey('1', self.activateOverviewTab);
        HotkeysService.registerHotkey('2', self.activateEncounterTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activatePartyTab);
        HotkeysService.registerHotkey('5', self.activateChatTab);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
        HotkeysService.flushHotkeys();
    };

    //Private Methods

    self._tabIsVisible = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };
}
