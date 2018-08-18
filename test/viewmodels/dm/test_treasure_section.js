import { Encounter } from 'charactersheet/models/dm/encounter';
import { EncounterArmor } from 'charactersheet/models/dm/encounter_sections/encounter_armor';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import { TreasureSectionViewModel } from 'charactersheet/viewmodels/dm/encounter_sections/treasure_section';
import simple from 'simple-mock';

describe('TreasureSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should not load model and section', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
        it('should load model and section', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Save', function() {
        it('should save model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.save();
        });
        it('should create and save a new model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.save();
        });
    });

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.delete();
        });
        it('should do nothing since it can\'t find the model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.delete();
        });
    });

    describe('setTreasure', function() {
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('armor');

            vm.setTreasure();

            vm.armorShow().should.equal(true);
            vm.armorFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('coins');

            vm.setTreasure();

            vm.coinsShow().should.equal(true);
            vm.coinsFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('item');

            vm.setTreasure();

            vm.itemShow().should.equal(true);
            vm.itemFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('magicItem');

            vm.setTreasure();

            vm.magicItemShow().should.equal(true);
            vm.magicItemFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('weapon');

            vm.setTreasure();

            vm.weaponShow().should.equal(true);
            vm.weaponFirstElementFocus().should.equal(true);
        });
        it('should allocate the correct model', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.itemType('');

            vm.setTreasure();
        });
    });

    /* Prepopulate Methods */

    describe('Should set autocomplete fields', function() {
        it('should set the value of armor type when an autocomplete is selected', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.blankTreasure().armorName('Plate');
            armorsVM.setArmorType('label', 'Light');

            armorsVM.blankTreasure().armorType().should.equal('Light');
        });
        it('should set the value of armor currency denomination when an autocomplete is selected', function() {
            var armorsVM = new ArmorViewModel();
            armorsVM.blankTreasure().armorName('Plate');
            armorsVM.setArmorCurrencyDenomination('label', 'GP');

            armorsVM.blankTreasure().armorCurrencyDenomination().should.equal('GP');
        });
        it('should set the value of item currency denomination when an autocomplete is selected', function() {
            var items = new ItemsViewModel();
            items.blankTreasure().itemName('Tinder Box');
            items.setItemCurrencyDenomination('label', 'GP');

            items.blankTreasure().itemCurrencyDenomination().should.equal('GP');
        });
        it('should set the value of magic item type when an autocomplete is selected', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.blankTreasure().magicItemName('Armor of Resistence');
            magicItems.setMagicItemType('label', 'Armor');

            magicItems.blankTreasure().magicItemType().should.equal('Armor');
        });
        it('should set the value of magic item rarity when an autocomplete is selected', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.blankTreasure().magicItemName('Armor of Resistence');
            magicItems.setMagicItemRarity('label', 'Legendary');

            magicItems.blankTreasure().magicItemRarity().should.equal('Legendary');
        });
        it('should set the value of weapon type when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponType('label', 'Melee');

            weapons.blankTreasure().weaponType().should.equal('Melee');
        });
        it('should set the value of weapon handedness when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponHandedness('label', 'One-Handed');

            weapons.blankTreasure().weaponHandedness().should.equal('One-Handed');
        });
        it('should set the value of weapon proficiency when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponProficiency('label', 'Simple');

            weapons.blankTreasure().weaponProficiency().should.equal('Simple');
        });
        it('should set the value of weapon currency denomination when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponCurrencyDenomination('label', 'GP');

            weapons.blankTreasure().weaponCurrencyDenomination().should.equal('GP');
        });
        it('should set the value of weapon damage type when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponDamageType('label', 'Acid');

            weapons.blankTreasure().weaponDamageType().should.equal('Acid');
        });
        it('should set the value of weapon property when an autocomplete is selected', function() {
            var weapons = new WeaponsViewModel();
            weapons.blankTreasure().weaponName('Sword');
            weapons.setWeaponProperty('label', 'Finesse');

            weapons.blankTreasure().weaponProperty().should.equal('Finesse');
        });
    });

    /* UI Methods */

    describe('Sort By', function() {
        it('should sort the list of treasure by given criteria', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel desc']);
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel asc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of treasure by given criteria', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel desc']);
            vm.sortArrow('nameLabel').should.equal('fa fa-arrow-down fa-color');
            vm.sortBy('nameLabel');
            vm.sort().should.equal(vm.sorts['nameLabel asc']);
            vm.sortArrow('nameLabel').should.equal('fa fa-arrow-up fa-color');
        });
    });

    describe('modalFinishedOpening', function() {
        it('perform actions after a modal has opened', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.modalFinishedOpening();
        });
    });

    describe('modalFinishedClosing', function() {
        it('perform actions after a modal has closed', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.modalFinishedClosing();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.selectPreviewTab();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new TreasureSectionViewModel(new Encounter());

            vm.previewTabStatus('active');
            vm.editTabStatus('');
            vm.selectEditTab();
            vm.previewTabStatus().should.equal('');
            vm.editTabStatus().should.equal('active');
        });
    });

    describe('Data has changed', function() {
        it('should load new data', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);

            vm._dataHasChanged();
        });
        it('should load new data', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findBy').returnWith([new EncounterArmor()]);

            vm._dataHasChanged();
        });
    });

    describe('Toggle modal', function() {
        it('should toggle modal and add AS to Treasure', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.openModal().should.equal(false);
            vm.toggleModal();
            vm.openModal().should.equal(true);
        });
    });

    describe('addModalFinishedClosing', function() {
        it('should toggle modal and add AS to Treasure', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.shouldShowDisclaimer(true);
            vm.blankTreasure(new EncounterArmor());
            vm.addModalFinishedClosing();
            vm.shouldShowDisclaimer().should.equal(false);
            Should.not.exist(vm.blankTreasure());
        });
    });

    /* CRUD */

    describe('Add Treasure', function() {
        it('should add new Treasure to array', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());

            vm.treasure().length.should.equal(0);
            vm.addTreasure();
            vm.treasure().length.should.equal(1);
        });
    });

    describe('Remove Treasure', function() {
        it('should remove Treasure from array', function() {
            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.addTreasure();
            vm.treasure().length.should.equal(1);

            vm.removeTreasure(vm.treasure().pop());

            vm.treasure().length.should.equal(0);
        });
    });

    describe('Edit Treasure', function() {
        it('should put a Treasure from the list of treasure into the selected slot', function() {

            var vm = new TreasureSectionViewModel(new Encounter());
            vm.blankTreasure(new EncounterArmor());
            vm.itemType('armor');
            vm.addTreasure();
            vm.treasure().length.should.equal(1);
            vm.editTreasure(vm.treasure()[0]);
        });
    });
});
