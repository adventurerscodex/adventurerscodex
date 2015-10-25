"use strict";

/** 
 * The Root View Model for the application. All other view models are children of this view model.
 * This view model contains the global import/export functionality for player data as well as the 
 * UI helpers for page layout and design.
 */
function RootViewModel() {
	var self = this;
	
	//Socket connection
	self.messenger = new Messenger();
	self.connected = ko.observable(false);
	self.defaultRoomId = ko.observable(null);
	
	self.playerType = ko.observable(PlayerTypes.characterPlayerType);
	self.activeTab = ko.observable(self.playerType().defaultTab);
	
	//Child View Models
	self.characterTabViewModel = ko.observable(new CharacterTabViewModel());
	self.dmTabViewModel = ko.observable(new DmTabViewModel());
	self.partyTabViewModel = ko.observable(new PartyTabViewModel(self));
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
    		summary = self.characterTabViewModel().profileViewModel().characterSummary();
    	} else {
    		summary = self.dmTabViewModel().campaignViewModel().campaignSummary();
    	}
    	return summary;
    });
    
    self.playerTitle = ko.computed(function() {
    	var name = '';
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
    		name = self.characterTabViewModel().profileViewModel().characterName();
    	} else {
    		name = self.dmTabViewModel().campaignViewModel().campaignName();
    	}
    	return name;
    });
    
    self.playerAuthor = ko.computed(function() {
    	var name = '';
    	if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
    		name = self.characterTabViewModel().profileViewModel().playerName();
    	} else {
    		name = self.dmTabViewModel().campaignViewModel().dmName();
    	}
    	return name;
    });
    
    self.pageTitle = ko.computed(function() {
    	return self.playerTitle() + ' by ' + self.playerAuthor()
    		+ ' | Adventurer\'s Codex';
    });

	//Public Methods
	
	self.init = function() {
		self.messenger.connect();
		self.partyTabViewModel().init();
	};
	
	self.key = function() {
		return getKey('');
	};

    self.clear = function() {
    	self.playerType(PlayerTypes.characterPlayerType)
    	self.characterTabViewModel().clear();
    	self.dmTabViewModel().clear();
    };

    self.importValues = function(values) {
    	self.playerType(values.playerType);
    	try {
		self.characterTabViewModel().importValues(values.characterTabViewModel);
		} catch(err) {}
    	try {
		self.dmTabViewModel().importValues(values.dmTabViewModel);
		} catch(err) {}
    };

    self.exportValues = function() {
    	return {
    		playerType: self.playerType(),
    		characterTabViewModel: self.characterTabViewModel().exportValues(),
    		dmTabViewModel: self.dmTabViewModel().exportValues(),
    	};
    };
    
    //Global Save/Load
    
    self.save = function() {
		localStorage[self.key()] = JSON.stringify(self.exportValues());		
    };

	/**
	 * Load any saved state if it exists. 
	 */
	self.load = function() {
		var state = localStorage[self.key()];
		if (state !== undefined) {
			self.importValues(JSON.parse(state));
		} 
 		self.activeTab(self.playerType().defaultTab);
	};

    self.saveToFile = function() {
    	var string = JSON.stringify(self.exportValues());
    	var filename = self.playerTitle();
    	var blob = new Blob([string], {type: "application/json"});
		saveAs(blob, filename);
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
	self.stats = ko.observable(new Stats());
	self.equippedItemsViewModel = ko.observable(new EquippedItemsViewModel(self));
	self.note = ko.observable(new Note());
    self.abilityScores = ko.observable(new AbilityScores());
    self.featuresTraitsViewModel = ko.observable(new FeaturesTraitsViewModel());
    self.spellSlotsViewModel = ko.observable(new SpellSlotsViewModel());
    self.equipmentViewModel = ko.observable(new EquipmentViewModel(self));
    self.spellbook = ko.observable(new Spellbook());
    self.skillTree = ko.observable(new SkillTree());
    self.treasure = ko.observable(new Treasure());
    self.featsProf = ko.observable(new FeatsProfViewModel());

    self.clear = function() {
    	self.profileViewModel().clear();
    	self.appearanceViewModel().clear();
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.featuresTraitsViewModel().clear();
    	self.equippedItemsViewModel().clear();
    	self.equipmentViewModel().clear();
    	self.spellSlotsViewModel().clear();
        self.spellbook().clear();
        self.treasure().clear();
        self.skillTree().clear();
        self.featsProf().clear();
    };

    self.importValues = function(values) {
		self.profileViewModel().importValues(values.profileViewModel);
		self.appearanceViewModel().importValues(values.appearanceViewModel);
		self.stats().importValues(values.stats);
		self.equipmentViewModel().importValues(values.equipmentViewModel);
		self.note().importValues(values.note);
		self.equippedItemsViewModel().importValues(values.equippedItemsViewModel);
		self.abilityScores().importValues(values.abilityScores);
		self.spellSlotsViewModel().importValues(values.spellSlotsViewModel);
		self.featuresTraitsViewModel().importValues(values.featuresTraitsViewModel);
		self.spellbook().importValues(values.spellbook);
		self.treasure().importValues(values.treasure);
		self.featsProf().importValues(values.featsProf);
		self.skillTree().importValues(values.skillTree);
    };

    self.exportValues = function() {
    	return {
    		profileViewModel: self.profileViewModel().exportValues(),
    		appearanceViewModel: self.appearanceViewModel().exportValues(),
    		note: self.note().exportValues(),
    		equippedItemsViewModel: self.equippedItemsViewModel().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlotsViewModel: self.spellSlotsViewModel().exportValues(),
 	    	featuresTraitsViewModel : self.featuresTraitsViewModel().exportValues(),
    		equipmentViewModel: self.equipmentViewModel().exportValues(),
            spellbook: self.spellbook().exportValues(),
            treasure: self.treasure().exportValues(),
            featsProf: self.featsProf().exportValues(),
            skillTree: self.skillTree().exportValues()
    	};
    };
};

function DmTabViewModel() {
	var self = this;
	
	self.notesViewModel = ko.observable(new Note());
	self.campaignViewModel = ko.observable(new CampaignViewModel());

    self.clear = function() {
    	self.notesViewModel().clear();
    	self.campaignViewModel().clear();
    };

    self.importValues = function(values) {
		self.notesViewModel().importValues(values.notesViewModel);
		self.campaignViewModel().importValues(values.campaignViewModel);
    };

    self.exportValues = function() {
    	return {
    		notesViewModel: self.notesViewModel().exportValues(),
    		campaignViewModel: self.campaignViewModel().exportValues()
    	};
    };
};

function PartyTabViewModel(parent) {
	var self = this;
	
	self.parent = parent;
	self.connected = self.parent.connected;
	self.messenger = self.parent.messenger;
	
	self.connectionManagerViewModel = ko.observable(new ConnectionManagerViewModel(self));
	self.partyChatViewModel = ko.observable(new PartyChatViewModel(self));
	
	self.init = function() {
		self.partyChatViewModel().init();
	};
	
    self.clear = function() {
    	self.partyChatViewModel().clear();
    };

    self.importValues = function(values) {
		self.partyChatViewModel().importValues(values.partyChatViewModel);
    };

    self.exportValues = function() {
    	return {
    		partyChatViewModel: self.partyChatViewModel().exportValues()
    	};
    };
};


function SettingsTabViewModel() {
	var self = this;

};

var PlayerTypes = {
	characterPlayerType: {
		key: 'character',
		visibleTabs: ['character', 'settings', 'party'],
		defaultTab: 'character'
	},
	dmPlayerType: {
		key: 'dm',
		visibleTabs: ['dm', 'settings', 'party'],
		defaultTab: 'dm'
	}
};

/**
 * Do preflight checks.
 * - Has the user been here before?
 * - Do they have a character? Etc.
 * - Load a pre-existing character 
 * - Set up automatic saving.
 */
var init = function(viewModel) {
	if (localStorage['character.characterKeys'] === undefined
			|| eval(localStorage['character.characterKeys']).length < 1) {
		window.location = '/characters'
	} else {
		//Set up the player type if it's the first time
		var ptKey = playerTypeFromUrl();
		if (ptKey) {
			for (var i in Object.keys(PlayerTypes)) {
				var type = PlayerTypes[Object.keys(PlayerTypes)[i]];
				if (type.key === ptKey) {
					viewModel.playerType(type);				
				}
			}    
		}
		//Load any saved state.
		viewModel.init();
		viewModel.load();
  	}
};
