"use strict";

describe('App', function() {
	var data = {"profileViewModel":{"characterName":"Joe the Pirate","playerName":"Brian Schrader","race":"Human","religion":"","typeClass":"Pirate","alignment":"Evil","gender":"Male","age":"122","height":"5'1\"","weight":"123","hairColor":"","eyeColor":"","skinColor":"","level":"12","exp":""},"note":{"text":"something cool"},"backpackViewModel":{"backpack":[{"itemName":"Something cool","itemIsEquippable":true,"itemDesc":"","itemBodyLocation":"","itemQty":0,"itemWeight":0,"itemCost":0},{"itemName":"Something","itemIsEquippable":true,"itemDesc":"","itemBodyLocation":"Somewhere","itemQty":0,"itemWeight":0,"itemCost":0}]},"stats":{"health":{"maxHitpoints":10,"tempHitpoints":0,"damage":"5"}},"abilityScores":{"str":"","str_modifier":"","dex":"","dex_modifier":"","con":"","con_modifier":"","int":"","int_modifier":"","wis":"","wis_modifier":"","cha":"","cha_modifier":""},"spellSlotsViewModel":{"slots":[]},"featuresTraitsViewModel":{"background":"Somewhere ","ideals":"Yes","flaws":"Nope","bonds":"eh."},"equipmentViewModel":{"equippedItems":[{"itemName":"Sword of swording","itemIsEquippable":true,"itemDesc":"A sword that does sword things.","itemBodyLocation":"Left hand","itemQty":"1","itemWeight":"1","itemCost":"100"}]},"spellbook":{"spellbook":[]},"treasure":{"platinum":"01","gold":"1","electrum":"1","silver":"1","copper":"1","misc":"11111"},"feats_prof":{"feats":"no luck","proficiencies":"simple"}};	
	
	describe('Global Clear', function() {
		it('should clear the values for all of the modules.', function() {
			var v = new ViewModel();
			v.importValues(data);
			v.clear();
			v.profileViewModel().playerName().should.equal("");
			v.profileViewModel().characterName().should.equal("");
			v.stats().health.maxHitpoints().should.equal(0);
			v.stats().health.tempHitpoints().should.equal(0);
			v.note().text().should.equal("");
		});
	});
	
	describe('Global Import', function() {
		it('should import a given json file.', function(){
			var v = new ViewModel();
			v.importValues(data);
			v.profileViewModel().playerName().should.equal(data.profileViewModel.playerName);
			v.profileViewModel().characterName().should.equal(data.profileViewModel.characterName);
			v.stats().health.maxHitpoints().should.equal(data.stats.health.maxHitpoints);
			v.stats().health.tempHitpoints().should.equal(data.stats.health.tempHitpoints);
			v.note().text().should.equal(data.note.text);
		});
	});
	 
	describe('Global Export', function() {	
		it('should export a given json file.', function(){
			var v = new ViewModel();
			v.importValues(data);
			var r = v.exportValues();
			r.profileViewModel.playerName.should.equal(data.profileViewModel.playerName);
			r.profileViewModel.characterName.should.equal(data.profileViewModel.characterName);
			r.stats.health.maxHitpoints.should.equal(data.stats.health.maxHitpoints);
			r.stats.health.tempHitpoints.should.equal(data.stats.health.tempHitpoints);
			r.note.text.should.equal(data.note.text);
		});
	}); 
});
