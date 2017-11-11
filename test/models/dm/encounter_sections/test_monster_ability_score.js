import Should from 'should';
import simple from 'simple-mock';

import { MonsterAbilityScore } from 'charactersheet/models';

describe('MonsterAbilityScore', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('modifierLabel', function() {
        it('should return the proper modifier label', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.value(12);

            var modifierLabel = monsterAbilityScore.modifierLabel();
            modifierLabel.should.equal('+ 1');
        });
        it('should return the proper modifier label', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.value(8);

            var modifierLabel = monsterAbilityScore.modifierLabel();
            modifierLabel.should.equal('- 1');
        });
        it('should return null', function() {
            var monsterAbilityScore = new MonsterAbilityScore();

            var modifierLabel = monsterAbilityScore.modifierLabel();
            Should.not.exist(modifierLabel);
        });
    });

    describe('modifier', function() {
        it('should return the proper modifier value', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.value(12);

            var modifier = monsterAbilityScore.modifier();
            modifier.should.equal(1);
        });
        it('should return null', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.value('boo');

            var modifier = monsterAbilityScore.modifier();
            Should.not.exist(modifier);
        });
    });
    describe('isNumeric', function() {
        it('should test if modifier is numeric', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            var actual = monsterAbilityScore.isNumeric(15);
            actual.should.equal(true);
            actual = monsterAbilityScore.isNumeric('');
            actual.should.equal(false);
        });
    });

    describe('Save', function() {
        it('should save monsterAbilityScore', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            var monsterAbilityScoreSpy = simple.mock(monsterAbilityScore.ps, 'save');

            monsterAbilityScore.save();
            monsterAbilityScoreSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete monsterAbilityScore', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            var monsterAbilityScoreSpy = simple.mock(monsterAbilityScore.ps, 'delete', function() {});

            monsterAbilityScore.delete();
            monsterAbilityScoreSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear monsterAbilityScore', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.name('blah');

            monsterAbilityScore.name().should.equal('blah');
            monsterAbilityScore.clear();
            Should.not.exist(monsterAbilityScore.name());
        });
    });

    describe('Import', function() {
        it('should import monsterAbilityScore', function() {
            var monsterAbilityScore = new MonsterAbilityScore();

            Should.not.exist(monsterAbilityScore.name());
            monsterAbilityScore.importValues({'name': 'blah'});
            monsterAbilityScore.name().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export monsterAbilityScore', function() {
            var monsterAbilityScore = new MonsterAbilityScore();
            monsterAbilityScore.name('blah');

            monsterAbilityScore.name().should.equal('blah');
            var exported = monsterAbilityScore.exportValues();
            exported.name.should.equal('blah');
        });
    });
});
