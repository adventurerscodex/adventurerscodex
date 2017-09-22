import simple from 'simple-mock'

import { AbilityScores,
    Armor,
    OtherStats } from 'charactersheet/models'
import { ArmorClassService } from 'charactersheet/services/character'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

describe('Armor Class Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should subscribe to relevant viewmodels and calculate first Armor Class', function() {
            var spy1 = simple.mock(Notifications.armor.changed, 'add');
            var spy2 = simple.mock(Notifications.abilityScores.dexterity.changed, 'add');
            var spy3 = simple.mock(Notifications.stats.armorClassModifier.changed, 'add');

            var armorClassService = ArmorClassService.sharedService();
            var spy4 = simple.mock(armorClassService, 'dataHasChanged').callFn(function() {});

            armorClassService.init();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
            spy3.called.should.equal(true);
            spy4.called.should.equal(true);
        });
    });

    describe('Data Has Changed', function() {
        it('should calculate Armor Class', function() {
            var spy = simple.mock(Notifications.armorClass.changed, 'dispatch');
            simple.mock(PersistenceService, 'findByPredicates').callFn(function(model, property, value) {
                if (model.name === 'Armor') {
                    var armor = new Armor();
                    armor.armorType('Light');
                    armor.armorClass(12);
                    armor.armorMagicalModifier(1);
                    return [armor];
                }
            });
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, property, value) {
                if (model.name === 'AbilityScores') {
                    var abilityScore = new AbilityScores();
                    abilityScore.dex(18);
                    abilityScore.modifierFor('Dex').should.equal(4);
                    return abilityScore;
                } else if (model.name === 'OtherStats') {
                    var otherStats = new OtherStats();
                    otherStats.armorClassModifier(2);
                    return otherStats;
                }
            });

            var armorClassService = ArmorClassService.sharedService();
            armorClassService.dataHasChanged();
            var armorClass = armorClassService.armorClass();
            /* Since we are mocking the persistance service call using predicates,
            it's calculating the armor twice, as if the armor is a shield.
            This is expected behavior.
            */
            armorClass.should.equal(32);
            spy.called.should.equal(true);
        });
    });

    describe('Base armor class', function() {
        it('should return the base armor class', function() {
            var armor = new Armor();
            armor.armorClass(17);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var armorClass = armorClassService.baseArmorClass();
            armorClass.should.equal(17);
        });
        it('should return AC 10 for base armor class when no armor is worn', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var armorClass = armorClassService.baseArmorClass();
            armorClass.should.equal(10);
        });
    });
    describe('Equipped Armor Magical Modifier', function() {
        it('should return magical modifier for equipped armor', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(1);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var equippedArmorMagicalModifier = armorClassService.equippedArmorMagicalModifier();
            equippedArmorMagicalModifier.should.equal(1);
        });
        it('should return magical modifier of 0 when no armor is worn', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var magicalModifier = armorClassService.equippedArmorMagicalModifier();
            magicalModifier.should.equal(0);
        });
    });
    describe('Equipped Shield Magical Modifier', function() {
        it('should return magical modifier for equipped shield', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(1);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var equippedShieldMagicalModifier = armorClassService.equippedShieldMagicalModifier();
            equippedShieldMagicalModifier.should.equal(1);
        });
        it('should return magical modifier of 0 when no shield is worn', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var magicalModifier = armorClassService.equippedShieldMagicalModifier();
            magicalModifier.should.equal(0);
        });
    });
    describe('At Least One Armor Equipped', function() {
        it('should return true if an armor or shield is equipped', function() {
            var armor = new Armor();

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var atLeastOneArmorEquipped = armorClassService.atLeastOneArmorEquipped();
            atLeastOneArmorEquipped.should.equal(true);
        });
        it('should return false if no armor or shield is equipped', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var atLeastOneArmorEquipped = armorClassService.atLeastOneArmorEquipped();
            atLeastOneArmorEquipped.should.equal(false);
        });
    });
    describe('Dex Bonus', function() {
        it('should return the dex bonus if armorType is Light', function() {
            var armor = new Armor();
            armor.armorEquipped('equipped');
            armor.armorType('Light');

            var abilityScore = new AbilityScores();
            abilityScore.dex(18);
            abilityScore.modifierFor('Dex').should.equal(4);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(abilityScore);

            var armorClassService = ArmorClassService.sharedService();
            var dexBonus = armorClassService.dexBonus();
            dexBonus.should.equal(4);
        });
        it('should return max dex bonus of 2 if armorType is Medium', function() {
            var armor = new Armor();
            armor.armorEquipped('equipped');
            armor.armorType('Medium');

            var abilityScore = new AbilityScores();
            abilityScore.dex(18);
            abilityScore.modifierFor('Dex').should.equal(4);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(abilityScore);

            var armorClassService = ArmorClassService.sharedService();
            var dexBonus = armorClassService.dexBonus();
            dexBonus.should.equal(2);
        });
        it('should return no dex bonus if armorType is Heavy', function() {
            var armor = new Armor();
            armor.armorEquipped('equipped');
            armor.armorType('Heavy');

            var abilityScore = new AbilityScores();
            abilityScore.dex(18);
            abilityScore.modifierFor('Dex').should.equal(4);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);
            simple.mock(PersistenceService, 'findFirstBy').returnWith(abilityScore);

            var armorClassService = ArmorClassService.sharedService();
            var dexBonus = armorClassService.dexBonus();
            dexBonus.should.equal(0);
        });
    });

    describe('Armor Class Modifier', function() {
        it('should return the armor class modifier for equipped armor', function() {
            var otherStats = new OtherStats();
            otherStats.armorClassModifier(2);

            simple.mock(PersistenceService, 'findFirstBy').returnWith(otherStats);

            var armorClassService = ArmorClassService.sharedService();
            var armorClassModifier = armorClassService.armorClassModifier();
            armorClassModifier.should.equal(2);
        });
    });
    describe('Get Equipped Shield Bonus', function() {
        it('should return shield AC if shield is equipped', function() {
            var armor = new Armor();
            armor.armorClass(2);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var equippedShieldBonus = armorClassService.getEquippedShieldBonus();
            equippedShieldBonus.should.equal(2);
        });
        it('should return 0 if no shield is equipped', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var equippedShieldBonus = armorClassService.getEquippedShieldBonus();
            equippedShieldBonus.should.equal(0);
        });
    });
    describe('Has Armor', function() {
        it('should return true if armor is equipped', function() {
            var armor = new Armor();
            armor.armorClass(2);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var hasArmor = armorClassService.hasArmor();
            hasArmor.should.equal(true);
        });
        it('should return false if no armor is equipped', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var hasArmor = armorClassService.hasArmor();
            hasArmor.should.equal(false);
        });
    });
    describe('Has Shield', function() {
        it('should return true if shield is equipped', function() {
            var armor = new Armor();
            armor.armorClass(2);

            simple.mock(PersistenceService, 'findByPredicates').returnWith([armor]);

            var armorClassService = ArmorClassService.sharedService();
            var hasShield = armorClassService.hasShield();
            hasShield.should.equal(true);
        });
        it('should return false if no shield is equipped', function() {
            simple.mock(PersistenceService, 'findByPredicates').returnWith([]);

            var armorClassService = ArmorClassService.sharedService();
            var hasShield = armorClassService.hasShield();
            hasShield.should.equal(false);
        });
    });
});
