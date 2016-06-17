'use strict';

var messenger;
var players;
var playerSummaryService;

/**
 * The Root View Model for the application. All other view models are children of this view model.
 * This view model contains the global import/export functionality for player data as well as the
 * UI helpers for page layout and design.
 */
function RootViewModel() {
    var self = this;

    /**
     * Once the app is ready to be displayed and all data has been loaded,
     * and the init process has finished.
      */
    self.ready = ko.observable(false);
    self.wizard = ko.observable(false);
    self._dummy = ko.observable(false);
    self.connected = ko.observable(false);

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self.activeTab = ko.observable();

    //Player Child View Models
    self.actionsToolbarViewModel = ko.observable(new ActionsToolbarViewModel());

    self.profileTabViewModel       = ko.observable(new ProfileTabViewModel());
    self.statsTabViewModel         = ko.observable(new StatsTabViewModel());
    self.skillsTabViewModel        = ko.observable(new SkillsTabViewModel());
    self.spellsTabViewModel        = ko.observable(new SpellsTabViewModel());
    self.equipmentTabViewModel     = ko.observable(new EquipmentTabViewModel());
    self.inventoryTabViewModel     = ko.observable(new InventoryTabViewModel());
    self.notesTabViewModel         = ko.observable(new NotesTabViewModel());

    //Misc
    self.wizardViewModel = new WizardViewModel();
    self.userNotificationViewModel = new UserNotificationViewModel();
    self.charactersViewModel = new CharactersViewModel();
    self.settingsViewModel = ko.observable(new SettingsViewModel());

    //Tooltips
    self.profileTooltip = ko.observable('Profile');
    self.statsTooltip = ko.observable('Stats');
    self.skillsTooltip = ko.observable('Skills');
    self.spellsTooltip = ko.observable('Spells');
    self.weaponsAndArmorTooltip = ko.observable('Weapons and Armor');
    self.backpackTooltip = ko.observable('Backpack');
    self.notesTooltip = ko.observable('Notes');

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

    //UI Methods

    self.playerSummary = ko.pureComputed(function() {
        self._dummy();
        var summary = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                summary = Profile.findBy(key)[0].characterSummary();
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
                name = Profile.findBy(key)[0].characterName();
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
                name = Profile.findBy(key)[0].playerName();
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

    self.showWizard = function() {
        //Unload the prior character.
        Notifications.global.unload.dispatch();
        self.ready(false);
        self.wizard(true);
    };

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        self.profileTabViewModel().init();
        self.statsTabViewModel().init();
        self.skillsTabViewModel().init();
        self.spellsTabViewModel().init();
        self.equipmentTabViewModel().init();
        self.inventoryTabViewModel().init();
        self.notesTabViewModel().init();
        self.charactersViewModel.init();
        self.userNotificationViewModel.init();

        //Subscriptions
        Notifications.profile.changed.add(function() {
            self._dummy.valueHasMutated();
        });
        self._dummy.valueHasMutated();
        Notifications.characters.allRemoved.add(function() {
            self.ready(false);
        });
        Notifications.global.load.add(self.load);
        Notifications.global.unload.add(self.unload);

        HotkeysService.registerHotkey('1', self.activateStatsTab);
        HotkeysService.registerHotkey('2', self.activateSkillsTab);
        HotkeysService.registerHotkey('3', self.activateSpellsTab);
        HotkeysService.registerHotkey('4', self.activateEquipmentTab);
        HotkeysService.registerHotkey('5', self.activateInventoryTab);
        HotkeysService.registerHotkey('6', self.activateNotesTab);
        HotkeysService.registerHotkey('7', self.activateProfileTab);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        if (CharacterManager.activeCharacter()) {
            self.activeTab(self.playerType().defaultTab);

            if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
                self.profileTabViewModel().load();
                self.statsTabViewModel().load();
                self.skillsTabViewModel().load();
                self.spellsTabViewModel().load();
                self.equipmentTabViewModel().load();
                self.inventoryTabViewModel().load();
                self.notesTabViewModel().load();
            }
            self.userNotificationViewModel.load();
            self.charactersViewModel.load();
            self.settingsViewModel().load();
            self.ready(true);
            self._dummy.valueHasMutated();
        }
    };

    self.unload = function() {
        if (CharacterManager.activeCharacter()) {
            if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
                self.profileTabViewModel().unload();
                self.statsTabViewModel().unload();
                self.skillsTabViewModel().unload();
                self.spellsTabViewModel().unload();
                self.equipmentTabViewModel().unload();
                self.inventoryTabViewModel().unload();
                self.notesTabViewModel().unload();
            }
            self.userNotificationViewModel.unload();
            self.charactersViewModel.unload();
            self.settingsViewModel().unload();
        }
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
}
