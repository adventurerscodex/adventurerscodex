import simple from 'simple-mock';

import { ProficiencyService } from 'charactersheet/services';
import { Weapon } from 'charactersheet/models/common/weapon';
import { WeaponFixture } from '../fixtures';

describe('Weapon Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the data', function() {
                var weap = new Weapon();
                weap.weaponName(WeaponFixture.weaponName);
                weap.weaponName().should.equal(WeaponFixture.weaponName);
                weap.clear();
                weap.weaponName().should.equal('');
            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var weap = new Weapon();
                weap.importValues(WeaponFixture);
                weap.weaponName().should.equal(WeaponFixture.weaponName);
                weap.characterId().should.equal(WeaponFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var weap = new Weapon();
                weap.importValues(WeaponFixture);
                var values = weap.exportValues();

                weap.characterId().should.equal(values.characterId);
                weap.weaponName().should.equal(values.weaponName);
            });
        });

        describe('Save', function() {
            it('should call the token save.', function() {
                var weap = new Weapon();
                var spy = simple.mock(weap.ps, 'save');
                weap.save();
                spy.called.should.equal(true);
            });
        });

        describe('Delete', function() {
            it('should call the token delete.', function() {
                var weap = new Weapon();
                var spy = simple.mock(weap.ps, 'delete', function(){});
                weap.delete();
                spy.called.should.equal(true);
            });
        });
    });

    describe('Update Values', function() {
        it('should call notify subscriber a value has changed', function() {
            var weap = new Weapon();
            var spy = simple.mock(weap._dummy, 'notifySubscribers');
            weap.updateValues();
            spy.called.should.equal(true);
        });
    });

    describe('Proficiency Score', function() {
        it('should get proficiency score from other stats', function() {
            var weap = new Weapon();
            simple.mock(ProficiencyService.sharedService(), 'proficiency').returnWith(4);

            var profBonus = weap.proficiencyScore();
            profBonus.should.equal(4);
        });
    });

    describe('Ability Score Bonus', function() {
        it('should get ability score bonus for ranged', function() {
            var weap = new Weapon();
            weap.weaponType('Ranged');
            simple.mock(weap, 'dexAbilityScoreModifier').returnWith(4);

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(4);
        });
        it('should get ability score bonus for melee finesse with more dex', function() {
            var weap = new Weapon();
            weap.weaponType('Melee');
            weap.weaponProperty('Finesse');
            simple.mock(weap, 'dexAbilityScoreModifier').returnWith(4);
            simple.mock(weap, 'strAbilityScoreModifier').returnWith(2);

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(4);
        });

        it('should get ability score bonus for melee finesse with more str', function() {
            var weap = new Weapon();
            weap.weaponType('Melee');
            weap.weaponProperty('Finesse');
            simple.mock(weap, 'dexAbilityScoreModifier').returnWith(2);
            simple.mock(weap, 'strAbilityScoreModifier').returnWith(3);

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(3);
        });
        it('should get ability score bonus for melee finesse with no dex bonus', function() {
            var weap = new Weapon();
            weap.weaponType('Melee');
            weap.weaponProperty('Finesse');
            simple.mock(weap, 'dexAbilityScoreModifier').returnWith('');
            simple.mock(weap, 'strAbilityScoreModifier').returnWith(3);

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(3);
        });
        it('should get ability score bonus for melee finesse with no dex & str bonus', function() {
            var weap = new Weapon();
            weap.weaponType('Melee');
            weap.weaponProperty('Finesse');
            simple.mock(weap, 'dexAbilityScoreModifier').returnWith('');
            simple.mock(weap, 'strAbilityScoreModifier').returnWith('');

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(0);
        });
        it('should get ability score bonus for melee with no finesse', function() {
            var weap = new Weapon();
            weap.weaponType('Melee');
            weap.weaponProperty('Martial');
            simple.mock(weap, 'strAbilityScoreModifier').returnWith(3);

            var asBonus = weap.abilityScoreBonus();
            asBonus.should.equal(3);
        });
    });

    describe('Total Bonus', function() {
        it('should sum up all hit related bonuses', function() {
            var weap = new Weapon();
            weap.weaponHit(1);
            weap.weaponToHitModifier(1);
            simple.mock(weap, 'abilityScoreBonus').returnWith(1);
            simple.mock(weap, 'proficiencyScore').returnWith(1);

            var totalBonus = weap.totalBonus();
            totalBonus.should.equal(4);
        });
    });

    describe('Hit Bonus Label', function() {
        it('should create a label for hit bonus positive bonus', function() {
            var weap = new Weapon();
            simple.mock(weap, 'totalBonus').returnWith(3);

            var totalBonus = weap.hitBonusLabel ();
            totalBonus.should.equal('+ 3');
        });
        it('should create a label for hit bonus negative bonus', function() {
            var weap = new Weapon();
            simple.mock(weap, 'totalBonus').returnWith(-3);

            var totalBonus = weap.hitBonusLabel ();
            totalBonus.should.equal('- 3');
        });
        it('should create a label for hit bonus no bonus', function() {
            var weap = new Weapon();
            simple.mock(weap, 'totalBonus').returnWith('');

            var totalBonus = weap.hitBonusLabel ();
            totalBonus.should.equal('+ 0');
        });
    });

    describe('Magical Modifier Label', function() {
        it('should create a badge for positive modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponHit(2);

            var totalBonus = weap.magicalModifierLabel();
            totalBonus.should.equal('+ 2');
        });
        it('should create a badge for negative modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponHit(-2);

            var totalBonus = weap.magicalModifierLabel();
            totalBonus.should.equal('- 2');
        });
        it('should create a badge for no modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponHit();

            var totalBonus = weap.magicalModifierLabel();
            totalBonus.should.equal('');
        });
    });

    describe('To Hit Modifier Label', function() {
        it('should create a badge for positive modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponToHitModifier(2);

            var totalBonus = weap.toHitModifierLabel();
            totalBonus.should.equal('+ 2');
        });
        it('should create a badge for negative modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponToHitModifier(-2);

            var totalBonus = weap.toHitModifierLabel();
            totalBonus.should.equal('- 2');
        });
        it('should create a badge for no modifier bonus', function() {
            var weap = new Weapon();
            weap.weaponToHitModifier();

            var totalBonus = weap.toHitModifierLabel();
            totalBonus.should.equal(0);
        });
    });

    describe('Apply Magical Modifier Label', function() {
        it('should return true if there is a magicalModifierLabel', function() {
            var weap = new Weapon();
            weap.weaponHit(2);

            weap.applyMagicalModifierLabel().should.equal(true);
        });
        it('should return false if there is on magicalModifierLabel', function() {
            var weap = new Weapon();
            weap.weaponHit(0);

            weap.applyMagicalModifierLabel().should.equal(false);
        });
    });

    describe('Weapon Description Label', function() {
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponDescription('This thing is cool.\n');
            weapon.weaponDescriptionHTML().should.equal('This thing is cool.<br />');

            var weapon2 = new Weapon();
            weapon2.weaponDescription('');
            weapon2.weaponDescriptionHTML().should.equal(
                '<div class="h3"><small>Add a description via the edit tab.</small></div>');
        });
    });

    describe('Weapon Weight Label', function() {
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponWeight(10);
            weapon.weaponWeightLabel().should.equal('10 lbs.');
        });
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponWeight(0);
            weapon.weaponWeightLabel().should.equal('0 lbs.');
        });
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponWeight('');
            weapon.weaponWeightLabel().should.equal('0 lbs.');
        });
    });

    describe('Weapon Range Label', function() {
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponType('Ranged');
            weapon.weaponRange('20/60');
            weapon.weaponRangeLabel().should.equal('20/60 ft.');
        });
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponType('Melee');
            weapon.weaponProperty('');
            weapon.weaponRangeLabel().should.equal('5 ft.');
        });
        it('should return the correct label', function() {
            var weapon = new Weapon();
            weapon.weaponType('Melee');
            weapon.weaponProperty('Thrown and Reach');
            weapon.weaponRangeLabel().should.equal('10 ft.');
        });
    });

});
