"use strict";

var messenger;
var players;

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
	
	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.activeTab = ko.observable(self.playerType().defaultTab);
	
	//Child View Models
	self.characterTabViewModel = ko.observable(new CharacterTabViewModel());
	self.dmTabViewModel = ko.observable(new DmTabViewModel());
	self.partyTabViewModel = ko.observable(new PartyTabViewModel());
	self.settingsTabViewModel = ko.observable(new SettingsTabViewModel());
	
	//Tab Properties
	self.characterTabStatus = ko.computed(function() {
		if (self.playerType().visibleTabs.indexOf('character') > -1) {
	    	return self.activeTab() === 'character' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    }); 
	self.dMTabStatus = ko.computed(function() {
		if (self.playerType().visibleTabs.indexOf('dm') > -1) {
	    	return self.activeTab() === 'dm' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.partyTabStatus = ko.computed(function() {
		if (self.playerType().visibleTabs.indexOf('party') > -1) {
	    	return self.activeTab() === 'party' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.settingsTabStatus = ko.computed(function() {
		if (self.playerType().visibleTabs.indexOf('settings') > -1) {
	    	return self.activeTab() === 'settings' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });

	self.activateCharacterTab = function() {
		self.activeTab('character');
	};
	self.activateDMTab = function() {
		self.activeTab('dm');
	};
	self.activatePartyTab = function() {
		self.activeTab('party');
	};
	self.activateSettingsTab = function() {
		self.activeTab('settings');
	};

	//UI Methods
    
    self.playerSummary = ko.computed(function() {
    	var summary = '';
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
			try {
				summary = Profile.find().characterSummary();
			} catch(err) {};
    	} else {
			try {
	    		summary = Campaign.find().campaignSummary();
			} catch(err) {};
    	}
    	return summary;
    });
    
    self.playerTitle = ko.computed(function() {
    	var name = '';
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
			try {
    			name = Profile.find().characterName();
			} catch(err) {};
    	} else {
			try {
    			name = Campaign.find().campaignName();
			} catch(err) {};
    	}
    	return name;
    });
    
    self.playerAuthor = ko.computed(function() {
    	var name = '';
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
			try {
    			name = Profile.find().playerName();
			} catch(err) {};
    	} else {
			try {
    			name = Campaign.find().dmName();
			} catch(err) {};
    	}
    	return name;
    });
    
    self.pageTitle = ko.computed(function() {
    	return self.playerTitle() + ' by ' + self.playerAuthor()
    		+ ' | Adventurer\'s Codex';
    });

	//Public Methods
	
	/**
	 * Call Init on each sub-module.
	 */
	self.init = function() {
		messenger = new Messenger();
		players = new Players();
	    messenger.connect();
		
		var character = Character.findBy(CharacterManager.getKey())[0];
		self.playerType(character.playerType());
		CharacterManager.changeCharacter(character.key());
	
 		if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
			self.characterTabViewModel().init();
 		} 
 		if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
			self.dmTabViewModel().init();
 		}
		self.partyTabViewModel().init();
		self.settingsTabViewModel().init();
	};
	
	/**
	 * Signal all modules to load their data.
	 */
	self.load = function() {
 		self.activeTab(self.playerType().defaultTab);
 		
 		if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
 			self.characterTabViewModel().load();
 		} 
 		if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
 			self.dmTabViewModel().load();
 		}
 		self.partyTabViewModel().load();
 		self.settingsTabViewModel().load();
 		self.ready(true);
	};

	self.unload = function() { 		
 		if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
 			self.characterTabViewModel().unload();
 		} 
 		if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
 			self.dmTabViewModel().unload();
 		}
 		self.partyTabViewModel().unload();
 		self.settingsTabViewModel().unload();
	};
};

/**
 * This view model contains all the relevant child view models for the character
 * tab. This should contain any child view models that relate to a player character
 * or to their character sheet.
 */
function CharacterTabViewModel() {
	var self = this;

	self.profileViewModel = ko.observable(new ProfileViewModel());
	self.appearanceViewModel = ko.observable(new AppearanceViewModel());
	self.statsViewModel = ko.observable(new StatsViewModel());
	//self.equippedItemsViewModel = ko.observable(new EquippedItemsViewModel(self));
	self.notesViewModel = ko.observable(new NotesViewModel());
    self.abilityScoresViewModel = ko.observable(new AbilityScoresViewModel());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());
    self.equipmentViewModel = ko.observable(new EquipmentViewModel());
    self.spellbookViewModel = ko.observable(new SpellbookViewModel());
    self.skillsViewModel = ko.observable(new SkillsViewModel());
    self.treasureViewModel = ko.observable(new TreasureViewModel());
    self.featsProfViewModel = ko.observable(new FeatsProfViewModel());
	self.savingThrowsViewModel = ko.observable(new SavingThrowsViewModel());
	self.spellStatsViewModel = ko.observable(new SpellStatsViewModel());
    self.savingThrowsViewModel = ko.observable(new SavingThrowsViewModel());
    
	self.init = function() {
    	//Init all viewModels.
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};

    self.load = function() {
    	//Init all viewModels.
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().load();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
    };
    
    self.unload = function() {
    	//unload all viewModels.
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().unload();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to unload.\n" + err;
    			}
    		}
    	}
    };
    
    self.clear = function() {
    	self.profileViewModel().clear();
    	self.appearanceViewModel().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.featuresTraitsViewModel().clear();
    	//self.equippedItemsViewModel().clear();
    	self.equipmentViewModel().clear();
    	self.spellSlotsViewModel().clear();
        self.spellbook().clear();
        self.treasure().clear();
        self.skillTree().clear();
        self.featsProf().clear();
		self.savingThrows.clear();
    };
};

function DmTabViewModel() {
	var self = this;
	
	self.notesViewModel = ko.observable(new NotesViewModel());
	self.campaignViewModel = ko.observable(new CampaignViewModel());
	self.enemiesViewModel = ko.observable(new EnemiesViewModel());
	
	self.init = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};

    self.load = function() {
    	//Init all viewModels.
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().load();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
    };
    
    self.unload = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().unload();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}    
    };

    self.clear = function() {
    	self.notesViewModel().clear();
    	self.campaignViewModel().clear();
    };
};

function PartyTabViewModel() {
	var self = this;
		
	self.connectionManagerViewModel = ko.observable(new ConnectionManagerViewModel());
	self.partyChatViewModel = ko.observable(new PartyChatViewModel());
	
	self.init = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};
	
	self.load = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().load();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};

    self.unload = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().unload();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
    };

    self.clear = function() {
    	self.partyChatViewModel().clear();
    };
};

function SettingsTabViewModel() {
	var self = this;

	self.init = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};

	self.load = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().load();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};
	
    self.unload = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().unload();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
    };
};

var init = function(viewModel) {
	//Load any saved state.
	viewModel.init();
	viewModel.load();
};

