"use strict";

describe('Root View Model', function() {
	var data = {"playerType":{"key":"character","visibleTabs":["character","settings","party"],"defaultTab":"character"},"characterTabViewModel":{"profileViewModel":{ "profile": {"characterName":"Brom","playerName":"Brian","race":"Elf","religion":"","typeClass":"Wizard","alignment":"","gender":"Male","age":"","height":"","weight":"","hairColor":"","eyeColor":"","skinColor":"","level":"11","exp":""}},"note":{"text":""},"backpackViewModel":{"backpack":[]},"stats":{"health":{"maxHitpoints":10,"tempHitpoints":0,"damage":0}},"abilityScores":{"str":"","str_modifier":"","dex":"","dex_modifier":"","con":"","con_modifier":"","int":"","int_modifier":"","wis":"","wis_modifier":"","cha":"","cha_modifier":""},"spellSlotsViewModel":{"slots":[]},"featuresTraitsViewModel":{"background":"","ideals":"","flaws":"","bonds":""},"equipmentViewModel":{"equippedItems":[]},"spellbook":{"spellbook":[]},"treasure":{"platinum":0,"gold":0,"electrum":0,"silver":0,"copper":0,"misc":""},"skillTree":{"skills":[]}}}
	
	describe('Global Clear', function() {
		it('should clear the values for all of the modules.', function() {
			var v = new RootViewModel();
			v.importValues(data);
			v.clear();
			v.characterTabViewModel().profileViewModel().profile().playerName().should.equal("");
			v.characterTabViewModel().profileViewModel().profile().characterName().should.equal("");
			v.characterTabViewModel().stats().health.maxHitpoints().should.equal(0);
			v.characterTabViewModel().stats().health.tempHitpoints().should.equal(0);
			v.characterTabViewModel().note().text().should.equal("");
		});
	});
	
	describe('Global Import', function() {
		it('should import a given json file.', function(){
			var v = new RootViewModel();
			v.importValues(data);
			v.characterTabViewModel().profileViewModel().profile().playerName().should.equal(data.characterTabViewModel.profileViewModel.profile.playerName);
			v.characterTabViewModel().profileViewModel().profile().characterName().should.equal(data.characterTabViewModel.profileViewModel.profile.characterName);
			v.characterTabViewModel().stats().health.maxHitpoints().should.equal(data.characterTabViewModel.stats.health.maxHitpoints);
			v.characterTabViewModel().stats().health.tempHitpoints().should.equal(data.characterTabViewModel.stats.health.tempHitpoints);
			v.characterTabViewModel().note().text().should.equal(data.characterTabViewModel.note.text);
		});
	});
	 
	describe('Global Export', function() {	
		it('should export a given json file.', function(){
			var v = new RootViewModel();
			v.importValues(data);
			var r = v.exportValues();
			r.characterTabViewModel.profileViewModel.profile.playerName.should.equal(data.characterTabViewModel.profileViewModel.profile.playerName);
			r.characterTabViewModel.profileViewModel.profile.characterName.should.equal(data.characterTabViewModel.profileViewModel.profile.characterName);
			r.characterTabViewModel.stats.health.maxHitpoints.should.equal(data.characterTabViewModel.stats.health.maxHitpoints);
			r.characterTabViewModel.stats.health.tempHitpoints.should.equal(data.characterTabViewModel.stats.health.tempHitpoints);
			r.characterTabViewModel.note.text.should.equal(data.characterTabViewModel.note.text);
		});
	}); 
});
