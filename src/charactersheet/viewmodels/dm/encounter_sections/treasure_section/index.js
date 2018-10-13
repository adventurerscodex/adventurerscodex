import {
    Armor,
    EncounterArmor,
    EncounterCoins,
    EncounterItem,
    EncounterMagicItem,
    EncounterWeapon,
    Item,
    MagicItem,
    Treasure,
    Wealth,
    Weapon
} from 'charactersheet/models';
import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services';

import breastplate from 'images/misc_icons/breastplate.svg';
import broadsword from 'images/misc_icons/broadsword.svg';
import coins from 'images/misc_icons/coins.svg';
import cpCoin from 'images/cp-coin.svg';
import epCoin from 'images/ep-coin.svg';
import gpCoin from 'images/gp-coin.svg';
import ko from 'knockout';
import potion from 'images/misc_icons/drink-me.svg';
import ppCoin from 'images/pp-coin.svg';
import sectionIcon from 'images/encounters/open-treasure-chest.svg';
import spCoin from 'images/sp-coin.svg';
import template from './index.html';
import wand from 'images/misc_icons/fairy-wand.svg';

export function TreasureSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.breastplate = breastplate;
    self.coins = coins;
    self.potion = potion;
    self.wand = wand;
    self.broadsword = broadsword;
    self.epCoin = epCoin;
    self.gpCoin = gpCoin;
    self.spCoin = spCoin;
    self.cpCoin = cpCoin;
    self.ppCoin = ppCoin;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!ko.unwrap(self.encounter)) { return; }
        return self.encounter().uuid();
    });
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.treasure = ko.observableArray();

    self.blankTreasure = ko.observable(null);
    self.itemType = ko.observable(null);
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);
    self.validationConstraints = {};

    self.armorShow = ko.observable(false);
    self.armorFirstElementFocus = ko.observable(false);
    self.coinsShow = ko.observable(false);
    self.coinsFirstElementFocus = ko.observable(false);
    self.itemShow = ko.observable(false);
    self.itemFirstElementFocus = ko.observable(false);
    self.magicItemShow = ko.observable(false);
    self.magicItemFirstElementFocus = ko.observable(false);
    self.weaponShow = ko.observable(false);
    self.weaponFirstElementFocus = ko.observable(false);
    self.shouldShowDisclaimer = ko.observable(false);

    self.MAGIC_ITEM = 'magic_item';
    self.ITEM = 'item';
    self.WEAPON = 'weapon';
    self.COINS = 'coins';
    self.ARMOR = 'armor';

    self.sorts = {
        'nameLabel asc': { field: 'nameLabel', direction: 'asc' },
        'nameLabel desc': { field: 'nameLabel', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['nameLabel asc']);

    /* Public Methods */
    self.load = async function() {
        Notifications.encounters.changed.add(self._dataHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        await self._dataHasChanged();
    };

    /* UI Methods */

    /**
     * Filters and sorts the weapons for presentation in a table.
     */
    self.filteredAndSortedTreasure = ko.computed(function() {
        return SortService.sortAndFilter(self.treasure(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.armorValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTreasure();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Armor.validationConstraints
    };

    self.armorUpdateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Armor.validationConstraints
    };

    self.wealthValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTreasure();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Wealth.validationConstraints
    };

    self.wealthUpdateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Wealth.validationConstraints
    };

    self.itemValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTreasure();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Item.validationConstraints
    };

    self.itemUpdateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Item.validationConstraints
    };

    self.magicItemValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTreasure();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...MagicItem.validationConstraints
    };

    self.magicItemUpdateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...MagicItem.validationConstraints
    };

    self.weaponValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTreasure();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Weapon.validationConstraints
    };

    self.weaponUpdateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Weapon.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        }
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.showAddButton = ko.pureComputed(() => {
        return self.itemType() == null ? false : true;
    });

    self.addTreasure = async function() {
        if (self.addFormIsValid()) {
            var treasure = self.convertToTreasureEntity(self.blankTreasure());
            treasure.coreUuid(CoreManager.activeCore().uuid());
            treasure.encounterUuid(self.encounterId());
            treasure.type(self.itemType());
            const treasureResponse = await treasure.ps.create();
            self.treasure.push(self.mapTreasureToModel(treasureResponse.object));
            self.toggleAddModal();
            self.blankTreasure(null);
            self.clearTreasureTemplates();
            self.itemType(null);
        }
    };

    self.setTreasure = function() {
        // Make sure no templates are showing when a new selection is made
        self.clearTreasureTemplates();

        // Based on selection, populate the treasure model
        if (self.itemType() == self.ARMOR) {
            self.blankTreasure(new EncounterArmor());
            self.armorShow(true);
            self.armorFirstElementFocus(true);
        } else if (self.itemType() == self.COINS) {
            self.blankTreasure(new EncounterCoins());
            self.coinsShow(true);
            self.coinsFirstElementFocus(true);
            self.validationConstraints = { ...Wealth.validationConstraints };
        } else if (self.itemType() == self.ITEM) {
            self.blankTreasure(new EncounterItem());
            self.itemShow(true);
            self.itemFirstElementFocus(true);
            self.validationConstraints = { ...Item.validationConstraints };
        } else if (self.itemType() == self.MAGIC_ITEM) {
            self.blankTreasure(new EncounterMagicItem());
            self.magicItemShow(true);
            self.magicItemFirstElementFocus(true);
            self.validationConstraints = { ...MagicItem.validationConstraints };
        } else if (self.itemType() == self.WEAPON) {
            self.blankTreasure(new EncounterWeapon());
            self.weaponShow(true);
            self.weaponFirstElementFocus(true);
            self.validationConstraints = { ...Weapon.validationConstraints };
        }
    };

    self.clearTreasureTemplates = function() {
        self.armorShow(false);
        self.coinsShow(false);
        self.itemShow(false);
        self.magicItemShow(false);
        self.weaponShow(false);
    };

    self.removeTreasure = async function(treasure) {
        let treasureEntity = self.convertToTreasureEntity(treasure);

        await treasureEntity.ps.delete();
        self.treasure.remove(treasure);
    };

    self.editTreasure = function(treasure) {
        self.selectPreviewTab();
        self.editItemIndex = treasure.uuid();
        if (treasure.type() == self.ARMOR) {
            self.currentEditItem(new EncounterArmor());
        } else if (treasure.type() == self.ITEM) {
            self.currentEditItem(new EncounterItem());
        } else if (treasure.type() == self.MAGIC_ITEM) {
            self.currentEditItem(new EncounterMagicItem());
        } else if (treasure.type() == self.WEAPON) {
            self.currentEditItem(new EncounterWeapon());
        } else if (treasure.type() == self.COINS) {
            self.currentEditItem(new EncounterCoins());
        } else {
            throw Error('Invalid Treasure type identifier ' + treasure.type());
        }

        self.currentEditItem().fromJSON(treasure.toJSON());
        self.openModal(true);
    };

    /* Auto-complete logic */

    self.treasurePrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys;
        if (self.itemType() == self.ARMOR) {
            keys = DataRepository.armors ? Object.keys(DataRepository.armors) : [];
        } else if (self.itemType() == self.ITEM) {
            keys = DataRepository.items ? Object.keys(DataRepository.items) : [];
        } else if (self.itemType() == self.MAGIC_ITEM) {
            keys = DataRepository.magicItems ? Object.keys(DataRepository.magicItems) : [];
        } else if (self.itemType() == self.WEAPON) {
            keys = DataRepository.weapons ? Object.keys(DataRepository.weapons) : [];
        }
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateTreasure = function(label, value) {
        var treasure;
        if (self.itemType() == self.ARMOR) {
            treasure = DataRepository.armors[label];
        } else if (self.itemType() == self.ITEM) {
            treasure = DataRepository.items[label];
        } else if (self.itemType() == self.MAGIC_ITEM) {
            treasure = DataRepository.magicItems[label];
        } else if (self.itemType() == self.WEAPON) {
            treasure = DataRepository.weapons[label];
        }

        self.blankTreasure().importValues(treasure);
        self.shouldShowDisclaimer(true);
    };

    self.setArmorType = function(label, value) {
        self.blankTreasure().armorType(value);
    };

    self.setArmorCurrencyDenomination = function(label, value) {
        self.blankTreasure().currencyDenomination(value);
    };

    self.setArmorStealth = function(label, value) {
        self.blankTreasure().stealth(value);
    };

    self.setItemCurrencyDenomination = function(label, value) {
        self.blankTreasure().currencyDenomination(value);
    };

    self.setMagicItemType = function(label, value) {
        self.blankTreasure().magicItemType(value);
    };

    self.setMagicItemRarity = function(label, value) {
        self.blankTreasure().rarity(value);
    };

    self.setWeaponType = function(label, value) {
        self.blankTreasure().weaponType(value);
    };

    self.setWeaponHandedness = function(label, value) {
        self.blankTreasure().handedness(value);
    };

    self.setWeaponProficiency = function(label, value) {
        self.blankTreasure().proficiency(value);
    };

    self.setWeaponCurrencyDenomination = function(label, value) {
        self.blankTreasure().currencyDenomination(value);
    };

    self.setWeaponDamageType = function(label, value) {
        self.blankTreasure().damageType(value);
    };

    self.setWeaponProperty = function(label, value) {
        self.blankTreasure().property(value);
    };

    /* Modal Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self.closeModal = () => {
        self.openModal(false);
    };

    self.addModalFinishedClosing = function() {
        self.blankTreasure(null);
        self.shouldShowDisclaimer(false);
        self.addModalOpen(false);
    };

    self.modalFinishedOpening = function() {

    };

    self.modalFinishedClosing = async function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            let treasure = self.convertToTreasureEntity(self.currentEditItem());
            let treasureResponse = await treasure.ps.save();
            self.treasure().forEach(function(item) {
                if (item.uuid() === self.editItemIndex) {
                    let newTreasure = self.mapTreasureToModel(treasureResponse.object);
                    item.fromJSON(newTreasure.toJSON());
                }
            });
        }

        self.openModal(false);
    };

    self.selectPreviewTab = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        var coreUuid = CoreManager.activeCore().uuid();
        const treasureResponse = await Treasure.ps.list({coreUuid, encounterUuid: self.encounterId()});

        self.convertTreasureResponse(treasureResponse.objects);

        var section = self.encounter().sections()[Fixtures.encounter.sections.treasure.index];

        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };

    self.convertTreasureResponse = (treasures) => {
        self.treasure([]);
        treasures.forEach((treasure) => {
            let newTreasure = self.mapTreasureToModel(treasure);
            self.treasure().push(newTreasure);
        });
        self.treasure.valueHasMutated();
    };

    self.mapTreasureToModel = (treasure) => {
        let newTreasure = null;
        if (treasure.type() == self.ARMOR) {
            newTreasure = new EncounterArmor();
        } else if (treasure.type() == self.ITEM) {
            newTreasure = new EncounterItem();
        } else if (treasure.type() == self.MAGIC_ITEM) {
            newTreasure = new EncounterMagicItem();
        } else if (treasure.type() == self.WEAPON) {
            newTreasure = new EncounterWeapon();
        } else if (treasure.type() == self.COINS) {
            newTreasure = new EncounterCoins();
        } else {
            throw Error('Invalid Treasure type identifier ' + treasure.type());
        }

        newTreasure.buildModelFromValues(treasure.value);
        newTreasure.type(treasure.type());
        newTreasure.coreUuid(treasure.coreUuid());
        newTreasure.uuid(treasure.uuid());
        newTreasure.encounterUuid(treasure.encounterUuid());
        return newTreasure;
    };

    /**
     * Converts a specific sub-model to a generic treasure model.
     *
     * @param treasure specific model
     * @returns generic treasure model
     */
    self.convertToTreasureEntity = (treasure) => {
        let treasureEntity = new Treasure();
        treasureEntity.uuid(treasure.uuid());
        treasureEntity.coreUuid(treasure.coreUuid());
        treasureEntity.encounterUuid(treasure.encounterUuid());
        treasureEntity.type(treasure.type());
        treasureEntity.value = treasure.getValues();

        return treasureEntity;
    };
}

ko.components.register('treasure-section', {
    viewModel: TreasureSectionViewModel,
    template: template
});
