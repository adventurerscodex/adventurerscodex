function DMRootViewModel() {
    var self = this;

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.partyStatus = ko.observable('');
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    //Player Child View Models
    self.playerImageViewModel = ko.observable(new PlayerImageViewModel());
    self.campaignTabViewModel = ko.observable(new CampaignTabViewModel());
    self.encounterTabViewModel = ko.observable(new EncounterTabViewModel());
    self.partyTabViewModel = ko.observable(new PartyTabViewModel());
    self.chatTabViewModel = ko.observable(new ChatTabViewModel());
    self.partyStatusLineViewModel = ko.observable(new PartyStatusLineViewModel());
    self.notesTabViewModel = ko.observable(new NotesTabViewModel());

    self.dmCardService = DMCardPublishingService.sharedService();
    self.imageService = ImageServiceManager.sharedService();

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
     * Call Init on each sub-module.
     */
    self.init = function() {
        HotkeysService.registerHotkey('1', self.activateOverviewTab);
        HotkeysService.registerHotkey('2', self.activateEncounterTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activateNotesTab);
        HotkeysService.registerHotkey('5', self.activatePartyTab);
        HotkeysService.registerHotkey('6', self.activateChatTab);

        self.dmCardService.init();
        self.imageService.init();
        self._updatePartyStatus(true);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        ViewModelUtilities.loadSubViewModels(self);

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
        Notifications.xmpp.disconnected.add(self._removeCurrentNode);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
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

    self._updatePartyStatus = function(success) {
        if (!success) { return; }
        var chat = ChatServiceManager.sharedService();
        self.isConnectedAndInAParty(chat.currentPartyNode);
        if (chat.currentPartyNode) {
            self.partyStatus('<i>You\'re connected to <span class=\"text-info\">' + Strophe.getNodeFromJid(chat.currentPartyNode) + '</span></i>.');
        } else {
            self.partyStatus('<i>You\'re not connected to a party.</i>');
        }
    };

    self._updateCurrentNode = function(node, success) {
        self.currentPartyNode(node);
        self._updatePartyStatus(success);
    };

    self._removeCurrentNode = function(node, success) {
        self.currentPartyNode(null);
        self._updatePartyStatus(success);
    };
}
