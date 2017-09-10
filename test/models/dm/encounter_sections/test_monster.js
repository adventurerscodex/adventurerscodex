describe('Monster', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('markDownDescription', function() {
        it('should return description for markdown', function() {
            var monster = new Monster();
            monster.description('blah');

            Should.exist(monster.description());
            var showMarkdown = monster.markDownDescription();
            showMarkdown.should.equal('blah');
        });
        it('should return blank', function() {
            var monster = new Monster();

            Should.not.exist(monster.description());
            var showMarkdown = monster.markDownDescription();
            showMarkdown.should.equal('');
        });
    });

    describe('nameLabel', function() {
        it('should give full name label', function() {
            var monster = new Monster();
            monster.size('Big');
            monster.type('Dragon');
            monster.alignment('Evil');

            var label = monster.nameLabel();
            label.should.equal('Big Dragon, Evil');
        });
        it('should give name label minus size', function() {
            var monster = new Monster();
            monster.type('Dragon');
            monster.alignment('Evil');

            var label = monster.nameLabel();
            label.should.equal('Dragon, Evil');
        });
        it('should give name label minus size & type', function() {
            var monster = new Monster();
            monster.alignment('Evil');

            var label = monster.nameLabel();
            label.should.equal('Evil');
        });
        it('should give name label minus size & type & alignment', function() {
            var monster = new Monster();

            var label = monster.nameLabel();
            label.should.equal('');
        });
    });

    describe('findAbilityScoreByName', function() {
        it('should return the matching ability score', function() {
            var monster = new Monster();
            var monsterScore = new MonsterAbilityScore();
            monsterScore.name('Dexterity');
            monster.abilityScores([monsterScore]);

            var foundScore = monster.findAbilityScoreByName('dexterity');
            foundScore.name().should.equal('Dexterity');
        });
        it('should return nothing', function() {
            var monster = new Monster();
            var monsterScore = new MonsterAbilityScore();
            monsterScore.name('Dexterity');
            monster.abilityScores([monsterScore]);

            var foundScore = monster.findAbilityScoreByName('Strength');
            Should.not.exist(foundScore);
        });
    });

    describe('Save', function() {
        it('should save monster', function() {
            var monster = new Monster();
            var monsterSpy = simple.mock(monster.ps, 'save');

            monster.save();
            monsterSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete monster', function() {
            var monster = new Monster();
            var monsterSpy = simple.mock(monster.ps, 'delete');

            monster.delete();
            monsterSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear monster', function() {
            var monster = new Monster();
            monster.description('blah');

            monster.description().should.equal('blah');
            monster.clear();
            Should.not.exist(monster.description());
        });
    });

    describe('Import', function() {
        it('should import monster', function() {
            var monster = new Monster();

            Should.not.exist(monster.description());
            monster.importValues({"description": 'blah'});
            monster.description().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export monster', function() {
            var monster = new Monster();
            monster.description('blah');

            monster.description().should.equal('blah');
            var exported = monster.exportValues();
            exported.description.should.equal('blah');
        });
    });
});
