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

	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.activeTab = ko.observable(self.playerType().defaultTab);

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
	self.charactersViewModel = new CharactersViewModel();
	self.settingsViewModel = ko.observable(new SettingsViewModel());
	self.connectionManagerViewModel = ko.observable(new ConnectionManagerViewModel());

	//Tab Properties
	self.profileTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('profile') > -1) {
			return self.activeTab() === 'profile' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.statsTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('stats') > -1) {
			return self.activeTab() === 'stats' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.skillsTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('skills') > -1) {
			return self.activeTab() === 'skills' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.spellsTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('spells') > -1) {
			return self.activeTab() === 'spells' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.equipmentTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('equipment') > -1) {
			return self.activeTab() === 'equipment' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.inventoryTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('inventory') > -1) {
			return self.activeTab() === 'inventory' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.notesTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('notes') > -1) {
			return self.activeTab() === 'notes' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.enemiesTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('enemies') > -1) {
			return self.activeTab() === 'enemies' ? 'active' : '';
		} else {
			return 'hidden';
		}
	});
	self.campaignTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('campaign') > -1) {
	    	return self.activeTab() === 'campaign' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.partyTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('party') > -1 && self.connected()) {
	    	return self.activeTab() === 'party' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
    });
	self.playerSummaryTabStatus = ko.pureComputed(function() {
		if (self.playerType().visibleTabs.indexOf('players') > -1 && self.connected()) {
	    	return self.activeTab() === 'players' ? 'active' : '';
    	} else {
    		return 'hidden';
    	}
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
			self.profileTabViewModel().init();
			self.statsTabViewModel().init();
			self.skillsTabViewModel().init();
			self.spellsTabViewModel().init();
			self.equipmentTabViewModel().init();
			self.inventoryTabViewModel().init();
			self.notesTabViewModel().init();
        }
        if (self.playerType().key === PlayerTypes.dmPlayerType.key) {
			self.campaignTabViewModel().init();
			self.enemiesTabViewModel().init();
			self.playerSummaryTabViewModel().init();
        }
        self.partyTabViewModel().init();
        self.connectionManagerViewModel().init();
        self.charactersViewModel.init();
        
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
            self.connectionManagerViewModel().load();
            self.charactersViewModel.load();
            self.settingsViewModel().load();
            self.ready(true);
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
            self.charactersViewModel.unload();
            self.settingsViewModel().unload();
        }
	};
};

/**
 * This view model contains the player's profile information.
 */
function ProfileTabViewModel() {
	var self = this;

	self.profileViewModel		 = ko.observable(new ProfileViewModel());
	self.appearanceViewModel 	 = ko.observable(new AppearanceViewModel());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());
	self.playerImageViewModel    = ko.observable(new PlayerImageViewModel());
	self.playerInfoViewModel     = ko.observable(new PlayerInfoViewModel());

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

/**
 * This view model contains the player's stats information.
 */
function StatsTabViewModel() {
	var self = this;

	self.statsViewModel 		= ko.observable(new StatsViewModel());
	self.abilityScoresViewModel = ko.observable(new AbilityScoresViewModel());
	self.savingThrowsViewModel  = ko.observable(new SavingThrowsViewModel());
	self.spellStatsViewModel    = ko.observable(new SpellStatsViewModel());


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

/**
 * This view model contains the player's skills information.
 */
function SkillsTabViewModel() {
	var self = this;

    self.featsProfViewModel = ko.observable(new FeatsProfViewModel());
    self.skillsViewModel    = ko.observable(new SkillsViewModel());

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

/**
 * This view model contains the player's spells information.
 */
function SpellsTabViewModel() {
	var self = this;

    self.spellbookViewModel  = ko.observable(new SpellbookViewModel());
	self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());

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

/**
 * This view model contains the player's equipment information.
 */
function EquipmentTabViewModel() {
	var self = this;

	self.weaponsViewModel = ko.observable(new WeaponsViewModel());
    self.armorViewModel = ko.observable(new ArmorViewModel());

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

/**
 * This view model contains the player's inventory information.
 */
function InventoryTabViewModel() {
	var self = this;

	self.equipmentViewModel = ko.observable(new EquipmentViewModel());
    self.treasureViewModel  = ko.observable(new TreasureViewModel());

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

/**
 * This view model contains the player's notes information.
 */
function NotesTabViewModel() {
	var self = this;

	self.notesViewModel = ko.observable(new NotesViewModel());

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

/**
 * This view model contains the DM's campaign information.
 */
function CampaignTabViewModel() {
	var self = this;

	self.campaignViewModel = ko.observable(new CampaignViewModel());

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
function EnemiesTabViewModel() {
	var self = this;

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

	self.partyChatViewModel         = ko.observable(new PartyChatViewModel());

	self.init = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to init.\n" + err;
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
    				throw "Module " + keys[i] + " failed to unload.\n" + err;
    			}
    		}
    	}
    };

    self.clear = function() {
    	self.partyChatViewModel().clear();
    };
};


function PlayerSummaryTabViewModel() {
	var self = this;

	self.playerSummaryViewModel = ko.observable(new PlayerSummaryViewModel());

	self.init = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to init.\n" + err;
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
    				throw "Module " + keys[i] + " failed to unload.\n" + err;
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
    players = new PlayersService();
    playerSummaryService = new PlayerSummaryService();
    
    messenger.connect();
    players.init();
    playerSummaryService.init();

    //Set up event handlers.
    Notifications.characterManager.changing.add(function() {
        //Don't save an empty character.
        if (CharacterManager.activeCharacter() && viewModel.ready()) {
            viewModel.unload();
            Notifications.global.unload.dispatch();
        }
    });
    Notifications.characterManager.changed.add(function() {
        try {
            viewModel.init();
            Notifications.global.init.dispatch();
            viewModel.load();
            Notifications.global.load.dispatch();
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
