'use strict';

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
                var spy = simple.mock(weap.ps, 'delete');
                weap.delete();
                spy.called.should.equal(true);
            });
        });
    });
    describe('Find By', function() {
        it('Should return a list of image models matching the given id.', function() {
            //Empty
            simple.mock(PersistenceService, 'findBy').returnWith([new Weapon()]);
            Weapon.findAllBy('someid').length.should.equal(0);

            //Filled
            simple.mock(PersistenceService, 'findAll').returnWith([new Weapon(), new Weapon()].map(function(e, i, _) {
                e.characterId('someid');
                return e;
            }));
            Weapon.findAllBy('someid').length.should.equal(2);
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
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(OtherStats, 'findBy').returnWith([{ proficiency: ko.observable(4)}]);

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
            simple.mock(weap, 'abilityScoreBonus').returnWith(1);
            simple.mock(weap, 'proficiencyScore').returnWith(1);

            var totalBonus = weap.totalBonus();
            totalBonus.should.equal(3);
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
});
