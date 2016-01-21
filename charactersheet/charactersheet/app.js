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
	self._dummy = ko.observable(false);
	
	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.activeTab = ko.observable(self.playerType().defaultTab);
	
	//Child View Models
	self.characterTabViewModel = ko.observable(new CharacterTabViewModel());
	self.dmTabViewModel = ko.observable(new DmTabViewModel());
	self.partyTabViewModel = ko.observable(new PartyTabViewModel());
	
	self.wizardViewModel = new WizardViewModel();
	self.charactersViewModel = new CharactersViewModel();
	self.settingsViewModel = ko.observable(new SettingsViewModel());
	
	//Tab Properties
	self.characterTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('character') > -1) {
	    	return self.activeTab() === 'character' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    }); 
	self.dMTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('dm') > -1) {
	    	return self.activeTab() === 'dm' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.partyTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('party') > -1) {
	    	return self.activeTab() === 'party' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.settingsTabStatus = ko.pureComputed(function() {
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
        self.ready(false);
        self.wizard(true);
    };

	//Public Methods
	
	/**
	 * Call Init on each sub-module.
	 */
	self.init = function() {
        var character = Character.findBy(
            CharacterManager.activeCharacter().key())[0];
        self.playerType(character.playerType());
        
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            self.characterTabViewModel().init();
        } 
        if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
            self.dmTabViewModel().init();
        }
        self.partyTabViewModel().init();
        self.charactersViewModel.init();
        self.settingsViewModel().init();  
        //Subscriptions   
        ProfileSignaler.changed.add(function() {
            self._dummy.valueHasMutated();
        });
        self._dummy.valueHasMutated();
        CharactersSignaler.allRemoved.add(function() {
            self.ready(false);
        });
	};
	
	/**
	 * Signal all modules to load their data.
	 */
	self.load = function() {
	    if (CharacterManager.activeCharacter()) {
            self.activeTab(self.playerType().defaultTab);
    
            if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
                self.characterTabViewModel().load();
            } 
            if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
                self.dmTabViewModel().load();
            }
            self.partyTabViewModel().load();
            self.charactersViewModel.load();
            self.settingsViewModel().load();  
            self.ready(true);
        }
	};

	self.unload = function() { 		
	    if (CharacterManager.activeCharacter()) {
            if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
                self.characterTabViewModel().unload();
            } 
            if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
                self.dmTabViewModel().unload();
            }
            self.partyTabViewModel().unload();
            self.charactersViewModel.unload();
            self.settingsViewModel().unload();  
        }
	};
};

/**
 * This view model contains all the relevant child view models for the character
 * tab. This should contain any child view models that relate to a player character
 * or to their character sheet.
 */
function CharacterTabViewModel() {
	var self = this;

    self.playerInfoViewModel = ko.observable(new PlayerInfoViewModel());
	self.profileViewModel = ko.observable(new ProfileViewModel());
	self.appearanceViewModel = ko.observable(new AppearanceViewModel());
	self.statsViewModel = ko.observable(new StatsViewModel());
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
    	Object.keys(self).forEach(function(key, i, _) {
    		if (key.indexOf('ViewModel') > -1) {
    			try {
	    			self[key]().init();
    			} catch(err) {
    				throw "Module " + key + " failed to load.\n" + err;
    			}
    		}
    	});
	};

    self.load = function() {
    	//Load all viewModels.
    	Object.keys(self).forEach(function(key, i, _) {
    		if (key.indexOf('ViewModel') > -1) {
    			try {
	    			self[key]().load();
    			} catch(err) {
    				throw "Module " + key + " failed to load.\n" + err;
    			}
    		}
    	});
    };
    
    self.unload = function() {
    	//unload all viewModels.
    	Object.keys(self).forEach(function(key, i, _) {
    		if (key.indexOf('ViewModel') > -1) {
    			try {
    	    		self[key]().unload();
    			} catch(err) {
    				throw "Module " + key + " failed to unload.\n" + err;
    			}
    		}
    	});
    };
    
    self.clear = function() {
    	//clear all viewModels.
    	Object.keys(self).forEach(function(key, i, _) {
    		if (key.indexOf('ViewModel') > -1) {
    			try {
    	    		self[key]().clear();
    			} catch(err) {
    				throw "Module " + key + " failed to unload.\n" + err;
    			}
    		}
    	});
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


var init = function(viewModel) {
    messenger = new Messenger();
    players = new Players();
    messenger.connect();
    
    //Set up event handlers.
    CharacterManagerSignaler.changing.add(function() {
        //Don't save an empty character.
        if (CharacterManager.activeCharacter() && viewModel.ready()) { 
            viewModel.unload();
        } 
    });
    CharacterManagerSignaler.changed.add(function() {
        try {
            viewModel.init();
            viewModel.load();
        } catch(err) {
            console.log(err)
            throw err
        }
    });
    
    //Check if a character already exists.
    if (CharacterManager.activeCharacter()) {
        CharacterManager.changeCharacter(
            CharacterManager.activeCharacter().key());
    }
};

/**
 * Times a given function's execution.
 */
var timeit = function(name, cb) {
    var t = new Date().getTime();
    cb();
    console.log(name + ': ' + String(new Date().getTime() - t));
};

