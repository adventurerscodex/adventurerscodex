"use strict";

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
	self.profileTabViewModel       = ko.observable(new ProfileTabViewModel());
	self.statsTabViewModel         = ko.observable(new StatsTabViewModel());
	self.skillsTabViewModel        = ko.observable(new SkillsTabViewModel());
	self.spellsTabViewModel        = ko.observable(new SpellsTabViewModel());
	self.equipmentTabViewModel     = ko.observable(new EquipmentTabViewModel());
	self.inventoryTabViewModel     = ko.observable(new InventoryTabViewModel());
	self.notesTabViewModel         = ko.observable(new NotesTabViewModel());
	self.partyTabViewModel         = ko.observable(new PartyTabViewModel());
	self.playerSummaryTabViewModel = ko.observable(new PlayerSummaryTabViewModel());

	//DM Child View Models
	self.campaignTabViewModel  = ko.observable(new CampaignTabViewModel());
	self.enemiesTabViewModel   = ko.observable(new EnemiesTabViewModel());

    //Misc
	self.wizardViewModel = new WizardViewModel();
	self.userNotificationViewModel = new UserNotificationViewModel();
	self.charactersViewModel = new CharactersViewModel();
	self.settingsViewModel = ko.observable(new SettingsViewModel());
	self.connectionManagerViewModel = ko.observable(new ConnectionManagerViewModel());

    //Tooltips
    self.profileTooltip = ko.observable('Profile');
    self.statsTooltip = ko.observable('Stats');
    self.skillsTooltip = ko.observable('Skills');
    self.spellsTooltip = ko.observable('Spells');
    self.weaponsAndArmorTooltip = ko.observable('Weapons and Armor');
    self.backpackTooltip = ko.observable('Backpack');
    self.notesTooltip = ko.observable('Notes');
    self.chatTooltip = ko.observable('Chat');

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
	self.enemiesTabStatus = ko.pureComputed(function() {
		return self._tabIsVisible('enemies');
	});
	self.campaignTabStatus = ko.pureComputed(function() {
		return self._tabIsVisible('campaign');
    });
	self.partyTabStatus = ko.pureComputed(function() {
		return self._tabIsVisibleAndConnected('party');
    });
	self.playerSummaryTabStatus = ko.pureComputed(function() {
		return self._tabIsVisibleAndConnected('players');
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
	self.activateEnemiesTab = function() {
		self.activeTab('enemies');
	};
	self.activateCampaignTab = function() {
		self.activeTab('campaign');
	};
	self.activatePartyTab = function() {
		self.activeTab('party');
	};
	self.activatePlayerSummaryTab = function() {
		self.activeTab('players');
	};

	//Tab shortcut Methods
	self.tabShortcut = function(data, event) {
		var type = event.target.type;
		var trigger = (event.target.id === '') &&
			(type !== 'number' && type !== 'text' && type !== 'textarea');
		if(trigger){
			var char = String.fromCharCode(event.which);
			var cb = self.hotkeys[char];
			if(typeof cb === 'function'){
				cb();
			}
		}
		return true;
	};

	self.hotkeys = {
		1: function() {
			self.activateProfileTab();
		},
		2: function() {
			self.activateStatsTab();
		},
		3: function() {
			self.activateSkillsTab();
		},
		4: function() {
			self.activateSpellsTab();
		},
		5: function() {
			self.activateEquipmentTab();
		},
		6: function() {
			self.activateInventoryTab();
		},
		7: function() {
			self.activateNotesTab();
		},
		8: function() {
			if(self.partyTabStatus() !== 'hidden'){
				self.activatePartyTab();
			}
		}
	};
	//UI Methods

    self.playerSummary = ko.pureComputed(function() {
	    self._dummy();
    	var summary = '';
    	var key = CharacterManager.activeCharacter().key();
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
			try {
				summary = Profile.findBy(key)[0].characterSummary();
			} catch(err) {};
    	} else {
			try {
	    		summary = Campaign.findBy(key)[0].campaignSummary();
			} catch(err) {};
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
			} catch(err) {};
    	} else {
			try {
    			name = Campaign.findBy(key)[0].campaignName();
			} catch(err) {};
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
			} catch(err) {};
    	} else {
			try {
    			name = Campaign.findBy(key)[0].dmName();
			} catch(err) {};
    	}
    	return name;
    });

    self.pageTitle = ko.pureComputed(function() {
	    self._dummy();
        try {
        	return self.playerTitle() + ' by ' + self.playerAuthor()
        		+ ' | Adventurer\'s Codex';
        } catch(err) {}
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
        self.campaignTabViewModel().init();
        self.enemiesTabViewModel().init();
        self.playerSummaryTabViewModel().init();
        self.partyTabViewModel().init();
        self.connectionManagerViewModel().init();
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
		Notifications.connectionManager.connected.add(function() {
		    self.connected(true);
		});
		Notifications.connectionManager.disconnected.add(function() {
		    self.connected(false);
		});
		Notifications.global.load.add(self.load);
		Notifications.global.unload.add(self.unload);

		HotkeysService.registerHotkey('1', self.activateProfileTab);
		HotkeysService.registerHotkey('2', self.activateStatsTab);
		HotkeysService.registerHotkey('3', self.activateSkillsTab);
		HotkeysService.registerHotkey('4', self.activateSpellsTab);
		HotkeysService.registerHotkey('5', self.activateEquipmentTab);
		HotkeysService.registerHotkey('6', self.activateInventoryTab);
		HotkeysService.registerHotkey('7', self.activateNotesTab);
		HotkeysService.registerHotkey('8', function() {
    		if(self.partyTabStatus() !== 'hidden'){
      			self.activatePartyTab();
    		}
		});
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
            if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
				self.campaignTabViewModel().load();
				self.enemiesTabViewModel().load();
			    self.playerSummaryTabViewModel().load();
            }
            self.partyTabViewModel().load();
            self.userNotificationViewModel.load();
            self.connectionManagerViewModel().load();
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
            if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
				self.campaignTabViewModel().unload();
				self.enemiesTabViewModel().unload();
			    self.playerSummaryTabViewModel().unload();
            }
            self.partyTabViewModel().unload();
            self.connectionManagerViewModel().unload();
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
};
