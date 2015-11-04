"use strict";

describe('Root View Model', function() {
	var data = {"playerType":{"key":"character","visibleTabs":["character","settings","party"],"defaultTab":"character"},"characterTabViewModel":{"profileViewModel":{"profile":{"characterName":"Brom Eriksson","playerName":"Brian Schrader","race":"Elf","religion":"","typeClass":"Wizard","alignment":"Good","gender":"Male","age":"123","level":"1","exp":"0"}},"appearanceViewModel":{"appearance":{"height":"","weight":"","hairColor":"","eyeColor":"","skinColor":""}},"note":{"text":"eqweqwweww"},"equippedItemsViewModel":{"equippedItems":[]},"stats":{"health":{"maxHitpoints":"37","tempHitpoints":"5","damage":"0"},"otherStats":{"ac":"23","initiative":"2","speed":"332","inspiration":"12"},"hitDiceList":[]},"abilityScores":{"str":18,"dex":18,"con":18,"int":18,"wis":18,"cha":18},"spellSlotsViewModel":{"slots":[{"level":1,"maxSpellSlots":1,"usedSpellSlots":0,"color":"progress-bar-blue"}]},"featuresTraitsViewModel":{"background":"","ideals":"","flaws":"","bonds":""},"equipmentViewModel":{"equipment":[{"itemName":"eqwewqewq","itemIsEquippable":false,"itemDesc":"","itemBodyLocation":"","itemQty":0,"itemWeight":0,"itemCost":0}]},"spellbook":{"spellbook":[{"spellName":"eqweqweqw","spellType":"","spellDmg":"","spellSchool":"","spellLevel":1,"spellDescription":"","spellCastingTime":"","spellRange":"","spellComponents":"","spellDuration":""}]},"treasureViewModel":{"treasure":{"platinum":0,"gold":0,"electrum":0,"silver":0,"copper":0,"misc":"qweqwqqeqeqw"}},"featsProf":{"feats":"","proficiencies":"","specialAbilities":""},"skillTree":{"skills":[{"name":"Acrobatics","abilityScore":"Dex","modifier":0},{"name":"Animal Handling","abilityScore":"Wis","modifier":0},{"name":"Arcana","abilityScore":"Int","modifier":0},{"name":"Athletics","abilityScore":"Str","modifier":0},{"name":"Deception","abilityScore":"Cha","modifier":0},{"name":"History","abilityScore":"Int","modifier":0},{"name":"Insight","abilityScore":"Wis","modifier":0},{"name":"Intimidation","abilityScore":"Cha","modifier":0},{"name":"Investigation","abilityScore":"Int","modifier":0},{"name":"Medicine","abilityScore":"Wis","modifier":0},{"name":"Nature","abilityScore":"Int","modifier":0},{"name":"Perception","abilityScore":"Wis","modifier":0},{"name":"Performance","abilityScore":"Cha","modifier":0},{"name":"Persuasion","abilityScore":"Cha","modifier":0},{"name":"Religion","abilityScore":"Int","modifier":0},{"name":"Sleight of Hand","abilityScore":"Dex","modifier":0},{"name":"Stealth","abilityScore":"Dex","modifier":0},{"name":"Survival","abilityScore":"Dex","modifier":0}]}},"dmTabViewModel":{"notesViewModel":{"text":""},"enemiesViewModel":{"enemies":[]},"campaignViewModel":{"campaignName":"","dmName":""}}}
	
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
