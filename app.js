"use strict";

/** 
 * The Root View Model for the application. All other view models are children of this view model.
 * This view model contains the global import/export functionality for player data as well as the 
 * UI helpers for page layout and design.
 */
function RootViewModel() {
	var self = this;
	
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

    self.pageTitle = ko.computed(function() {
    	return self.characterTabViewModel().profileViewModel().characterName() + ' by ' 
    		+ self.characterTabViewModel().profileViewModel().playerName()
    		+ ' | Adventurer\'s Codex';
    });
    
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
    
	//Public Methods
	
	self.key = function() {
		return getKey('character');
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
		var state = JSON.stringify(self.exportValues());
		localStorage[self.key()] = state;		
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
    	var filename = self.profileViewModel().characterName();
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
	self.stats = ko.observable(new Stats());
	self.backpackViewModel = ko.observable(new BackpackViewModel(self));
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
    	self.note().clear();
    	self.abilityScores().clear();
    	self.stats().clear();
    	self.featuresTraitsViewModel().clear();
    	self.backpackViewModel().clear();
    	self.equipmentViewModel().clear();
    	self.spellSlotsViewModel().clear();
        self.spellbook().clear();
        self.treasure().clear();
        self.skillTree().clear();
        self.featsProf().clear();
    };

    self.importValues = function(values) {
		self.profileViewModel().importValues(values.profileViewModel);
		self.stats().importValues(values.stats);
		self.equipmentViewModel().importValues(values.equipmentViewModel);
		self.note().importValues(values.note);
		self.backpackViewModel().importValues(values.backpackViewModel);
		self.abilityScores().importValues(values.abilityScores);
		self.spellSlotsViewModel().importValues(values.spellSlotsViewModel);
		self.featuresTraitsViewModel().importValues(values.featuresTraitsViewModel);
		self.spellbook().importValues(values.spellbook);
		self.treasure().importValues(values.treasure);
		//self.featsProf().importValues(values.feats_prof);
		self.skillTree().importValues(values.skillTree);
    };

    self.exportValues = function() {
    	return {
    		profileViewModel: self.profileViewModel().exportValues(),
    		note: self.note().exportValues(),
    		backpackViewModel: self.backpackViewModel().exportValues(),
    		stats: self.stats().exportValues(),
    		abilityScores: self.abilityScores().exportValues(),
    		spellSlotsViewModel: self.spellSlotsViewModel().exportValues(),
 	    	featuresTraitsViewModel : self.featuresTraitsViewModel().exportValues(),
    		equipmentViewModel: self.equipmentViewModel().exportValues(),
            spellbook: self.spellbook().exportValues(),
            treasure: self.treasure().exportValues(),
            skillTree: self.skillTree().exportValues()
    	};
    };
};

function DmTabViewModel() {
	var self = this;
	
	self.notesViewModel = ko.observable(new Note());
	self.campaignViewModel = ko.observable(new CampaignViewModel());

    self.clear = function() {
    	self.note().clear();
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


function PartyTabViewModel() {
	var self = this;

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
		viewModel.load();

		//Setup automatic saving.
		var saveState = function(){
			viewModel.save();
		};
		window.onbeforeunload = saveState;
		window.onblur = saveState;
		setInterval(saveState, 1000);
  	}
};
