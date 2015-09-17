describe('App', function() {
	var data = {
		"user": {
			"characterName":"Brom Eriksson",
			"playerName":"Brian Schrader",
			"race":"Half-Elf",
			"religion":"",
			"typeClass":"Wizard",
			"alignment":"Good",
			"gender":"Male",
			"level":"5",
			"exp":"5030"
		},
		"note": {
			"text":"This is something cool."
		},
		"stats": {
			"health": {
				"maxHitpoints":"7",
				"tempHitpoints":"6",
				"damage":"0"
			}
		}, 
		"abilityScores": {
			"str":"8",
			"str_modifier":"0",
			"dex":"12",
			"dex_modifier":"1",
			"con":"10",
			"con_modifier":"0",
			"int":"15",
			"int_modifier":"2",
			"wis":"13",
			"wis_modifier":"0",
			"cha":"12",
			"cha_modifier":"0"
		},
		"spellSlots": {
			"slots": [
				{
					"level":"3",
					"maxSpellSlots":"7",
					"usedSpellSlots":"4"
				}
			]
		}
	};
	
	describe('Global Clear', function() {
		it('should clear the values for all of the modules.', function() {
			var v = new ViewModel();
			v.fileReader.json = data;
			v.importValues();
			v.clear();
			v.user().playerName().should.equal("");
			v.user().characterName().should.equal("");
			v.stats().health.maxHitpoints().should.equal("");
			v.stats().health.tempHitpoints().should.equal("");
			v.note().text().should.equal("");
		});
	});
	
	describe('Global Import', function() {
		it('should import a given json file.', function(){
			var v = new ViewModel();
			v.fileReader.json = data;
			v.importValues();
			v.user().playerName().should.equal(data.user.playerName);
			v.user().characterName().should.equal(data.user.characterName);
			v.stats().health.maxHitpoints().should.equal(data.stats.health.maxHitpoints);
			v.stats().health.tempHitpoints().should.equal(data.stats.health.tempHitpoints);
			v.note().text().should.equal(data.note.text);
		});
	});
	 
	/*describe('Global Export', function() {	
		it('should export a given json file.', function(){
			
		});
	}); 
	
	describe('JSON Parse', function() {
		it('should parse a given json text file and make an object out of it.' function() {
		
		});
	}); */
});
