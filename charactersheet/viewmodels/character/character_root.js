'use strict';

function CharacterRootViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'character/index.tmpl';
    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);

    //Player Child View Models
    self.actionsToolbarViewModel   = ko.observable(new ActionsToolbarViewModel());
    self.statusLineViewModel       = ko.observable(new StatusLineViewModel());

    self.profileTabViewModel       = ko.observable(new ProfileTabViewModel());
    self.statsTabViewModel         = ko.observable(new StatsTabViewModel());
    self.skillsTabViewModel        = ko.observable(new SkillsTabViewModel());
    self.spellsTabViewModel        = ko.observable(new SpellsTabViewModel());
    self.equipmentTabViewModel     = ko.observable(new EquipmentTabViewModel());
    self.inventoryTabViewModel     = ko.observable(new InventoryTabViewModel());
    self.notesTabViewModel         = ko.observable(new NotesTabViewModel());
    self.exhibitTabViewModel       = ko.observable(new ExhibitTabViewModel());
    self.playerImageViewModel      = ko.observable(new PlayerImageViewModel());
    self.chatTabViewModel          = ko.observable(new ChatTabViewModel());

    // Services
    self.statusLineService = StatusService.sharedService();
    self.proficiencyService = ProficiencyService.sharedService();
    self.armorClassService = ArmorClassService.sharedService();
    self.characterCardPublishingService = CharacterCardPublishingService.sharedService();

    //Tooltips
    self.profileTooltip = ko.observable('Profile');
    self.statsTooltip = ko.observable('Stats');
    self.skillsTooltip = ko.observable('Skills');
    self.spellsTooltip = ko.observable('Spells');
    self.weaponsAndArmorTooltip = ko.observable('Weapons and Armor');
    self.backpackTooltip = ko.observable('Backpack');
    self.notesTooltip = ko.observable('Notes');
    self.partyTooltip = ko.observable('Party');
    self.chatTooltip = ko.observable('Chat');
    self.exhibitTooltip = ko.observable('Exhibit');

    //Tab Properties
    self.profileTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('profile');
    });
    self.statsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('stats');
    });
    self.skillsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('skills');
    });
    self.spellsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('spells');
    });
    self.equipmentTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('equipment');
    });
    self.inventoryTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('inventory');
    });
    self.notesTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('notes');
    });
    self.chatTabStatus = ko.pureComputed(function() {
        if (self.isConnectedAndInAParty()) {
            return self._tabIsVisible('chat');
        }
        return 'hidden';
    });
    self.partyTabStatus = ko.pureComputed(function() {
        if (self.isConnectedAndInAParty()) {
            return self._tabIsVisible('party');
        }
        return 'hidden';
    });
    self.exhibitTabStatus = ko.pureComputed(function() {
        if (self.isConnectedAndInAParty()) {
            return self._tabIsVisible('exhibit');
        }
        return 'hidden';
    });

    self.activateProfileTab = function() {
        self.activeTab('profile');
    };
    self.activateStatsTab = function() {
        self.activeTab('stats');
    };
    self.activateSkillsTab = function() {
        self.activeTab('skills');
    };
    self.activateSpellsTab = function() {
        self.activeTab('spells');
    };
    self.activateEquipmentTab = function() {
        self.activeTab('equipment');
    };
    self.activateInventoryTab = function() {
        self.activeTab('inventory');
    };
    self.activateNotesTab = function() {
        self.activeTab('notes');
    };
    self.activatePartyTab = function() {
        self.activeTab('party');
    };
    self.activateChatTab = function() {
        self.activeTab('chat');
    };
    self.activateChatTabFromHotkey = function() {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode != null) {
            self.activeTab('chat');
        }
    };
    self.activateExhibitTab = function() {
        self.activeTab('exhibit');
    };
    self.activateExhibitTabFromHotkey = function() {
        var chat = ChatServiceManager.sharedService();
        if (chat.currentPartyNode != null) {
            self.activeTab('exhibit');
        }
    };

    self.toggleWell = function() {
        Notifications.actionsToolbar.toggle.dispatch();
    };

    //UI Methods

    self.playerSummary = ko.pureComputed(function() {
        self._dummy();
        var summary = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                summary = PersistenceService.findBy(Profile, 'characterId', key)[0].characterSummary();
            } catch(err) { /*Ignore*/ }
        }
        return summary;
    });

    self.playerTitle = ko.pureComputed(function() {
        self._dummy();
        var name = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].characterName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.playerAuthor = ko.pureComputed(function() {
        self._dummy();
        var name = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].playerName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.pageTitle = ko.pureComputed(function() {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    //Public Methods

    /**
     * Call Init on services
     */
    self.init = function() {
        self.statusLineService.init();
        self.proficiencyService.init();
        self.armorClassService.init();
        self.characterCardPublishingService.init();

        //Subscriptions
        Notifications.profile.changed.add(function() {
            self._dummy.valueHasMutated();
        });

        HotkeysService.registerHotkey('1', self.activateStatsTab);
        HotkeysService.registerHotkey('2', self.activateSkillsTab);
        HotkeysService.registerHotkey('3', self.activateSpellsTab);
        HotkeysService.registerHotkey('4', self.activateEquipmentTab);
        HotkeysService.registerHotkey('5', self.activateInventoryTab);
        HotkeysService.registerHotkey('6', self.activateNotesTab);
        HotkeysService.registerHotkey('7', self.activateProfileTab);
        HotkeysService.registerHotkey('8', self.activateChatTabFromHotkey);
        HotkeysService.registerHotkey('9', self.activateExhibitTabFromHotkey);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        ViewModelUtilities.loadSubViewModels(self);

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);

        HotkeysService.flushHotkeys();

        Notifications.party.joined.remove(self._updateCurrentNode);
        Notifications.party.joined.remove(self._removeCurrentNode);
    };

    //Private Methods

    self._tabIsVisible = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._tabIsVisibleAndConnected = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1 && self.connected()) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._updatePartyStatus = function() {
        var xmpp = XMPPService.sharedService();
        self.isConnectedAndInAParty(xmpp.connection.connected && self.currentPartyNode());
    };

    self._updateCurrentNode = function(node) {
        self.currentPartyNode(node);
        self._updatePartyStatus();
    };

    self._removeCurrentNode = function(node) {
        self.currentPartyNode(null);
        self._updatePartyStatus();
    };

}
