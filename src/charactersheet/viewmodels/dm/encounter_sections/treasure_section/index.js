import {
    CoreManager,
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    EncounterArmor,
    EncounterCoins,
    EncounterItem,
    EncounterMagicItem,
    EncounterWeapon,
    TreasureSection
} from 'charactersheet/models';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';

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
    self.encounter   = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!self.encounter()) { return; }
        return self.encounter().encounterId();
    });
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.treasure = ko.observableArray();

    /**
     * A list of types to accept/load into the treasure.
     */
    self.treasureTypes = [
        EncounterItem, EncounterWeapon, EncounterMagicItem, EncounterArmor, EncounterCoins
    ];

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

    self.sorts = {
        'nameLabel asc': { field: 'nameLabel', direction: 'asc' },
        'nameLabel desc': { field: 'nameLabel', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['nameLabel asc']);

    /* Public Methods */
    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);


        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    self.save = function() {
        var key = CoreManager.activeCore().uuid();
        var section = PersistenceService.findByPredicates(TreasureSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new TreasureSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.treasure().forEach(function(treasure, idx, _) {
            treasure.save();
        });
    };

    self.delete = function() {
        var key = CoreManager.activeCore().uuid();
        var section = PersistenceService.findByPredicates(TreasureSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (section) {
            section.delete();
        }

        self.treasure().forEach(function(treasure, idx, _) {
            treasure.delete();
        });
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

    self.addTreasure = function() {
        var treasure = self.blankTreasure();
        treasure.characterId(CoreManager.activeCore().uuid());
        treasure.encounterId(self.encounterId());
        treasure.treasureType(self.itemType());
        treasure.save();
        self.treasure.push(treasure);
        self.blankTreasure(null);
        self.clearTreasureTemplates();
        self.itemType('');
    };

    self.setTreasure = function() {
        // Make sure no templates are showing when a new selection is made
        self.clearTreasureTemplates();

        // Based on selection, populate the treasure model
        if (self.itemType() == 'armor') {
            self.blankTreasure(new EncounterArmor());
            self.armorShow(true);
            self.armorFirstElementFocus(true);
        } else if (self.itemType() == 'coins') {
            self.blankTreasure(new EncounterCoins());
            self.coinsShow(true);
            self.coinsFirstElementFocus(true);
        } else if (self.itemType() == 'item') {
            self.blankTreasure(new EncounterItem());
            self.itemShow(true);
            self.itemFirstElementFocus(true);
        } else if (self.itemType() == 'magicItem') {
            self.blankTreasure(new EncounterMagicItem());
            self.magicItemShow(true);
            self.magicItemFirstElementFocus(true);
        } else if (self.itemType() == 'weapon') {
            self.blankTreasure(new EncounterWeapon());
            self.weaponShow(true);
            self.weaponFirstElementFocus(true);
        }
    };

    self.clearTreasureTemplates = function() {
        self.armorShow(false);
        self.coinsShow(false);
        self.itemShow(false);
        self.magicItemShow(false);
        self.weaponShow(false);
    };

    self.removeTreasure = function(treasure) {
        treasure.delete();
        self.treasure.remove(treasure);
    };

    self.editTreasure = function(treasure) {
        self.selectPreviewTab();
        self.editItemIndex = treasure.__id;
        if (treasure.treasureType() == 'armor') {
            self.currentEditItem(new EncounterArmor());
        } else if (treasure.treasureType() == 'item') {
            self.currentEditItem(new EncounterItem());
        } else if (treasure.treasureType() == 'magicItem') {
            self.currentEditItem(new EncounterMagicItem());
        } else if (treasure.treasureType() == 'weapon') {
            self.currentEditItem(new EncounterWeapon());
        } else if (treasure.treasureType() == 'coins') {
            self.currentEditItem(new EncounterCoins());
        } else {
            throw Error('Invalid Treasure type identifier ' + treasure.treasureType());
        }

        self.currentEditItem().importValues(treasure.exportValues());
        self.openModal(true);
    };

    /* Auto-complete logic */

    self.treasurePrePopFilter = function(request, response) {
        var term = request.term.toLowerCase();
        var keys;
        if (self.itemType() == 'armor') {
            keys = DataRepository.armors ? Object.keys(DataRepository.armors) : [];
        } else if (self.itemType() == 'item') {
            keys = DataRepository.items ? Object.keys(DataRepository.items) : [];
        } else if (self.itemType() == 'magicItem') {
            keys = DataRepository.magicItems ? Object.keys(DataRepository.magicItems) : [];
        } else if (self.itemType() == 'weapon') {
            keys = DataRepository.weapons ? Object.keys(DataRepository.weapons) : [];
        }
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    self.populateTreasure = function(label, value) {
        var treasure;
        if (self.itemType() == 'armor') {
            treasure = DataRepository.armors[label];
        } else if (self.itemType() == 'item') {
            treasure = DataRepository.items[label];
        } else if (self.itemType() == 'magicItem') {
            treasure = DataRepository.magicItems[label];
        } else if (self.itemType() == 'weapon') {
            treasure = DataRepository.weapons[label];
        }

        self.blankTreasure().importValues(treasure);
        self.shouldShowDisclaimer(true);
    };

    self.setArmorType = function(label, value) {
        self.blankTreasure().armorType(value);
    };

    self.setArmorCurrencyDenomination = function(label, value) {
        self.blankTreasure().armorCurrencyDenomination(value);
    };

    self.setArmorStealth = function(label, value) {
        self.blankTreasure().armorStealth(value);
    };

    self.setItemCurrencyDenomination = function(label, value) {
        self.blankTreasure().itemCurrencyDenomination(value);
    };

    self.setMagicItemType = function(label, value) {
        self.blankTreasure().magicItemType(value);
    };

    self.setMagicItemRarity = function(label, value) {
        self.blankTreasure().magicItemRarity(value);
    };

    self.setWeaponType = function(label, value) {
        self.blankTreasure().weaponType(value);
    };

    self.setWeaponHandedness = function(label, value) {
        self.blankTreasure().weaponHandedness(value);
    };

    self.setWeaponProficiency = function(label, value) {
        self.blankTreasure().weaponProficiency(value);
    };

    self.setWeaponCurrencyDenomination = function(label, value) {
        self.blankTreasure().weaponCurrencyDenomination(value);
    };

    self.setWeaponDamageType = function(label, value) {
        self.blankTreasure().weaponDamageType(value);
    };

    self.setWeaponProperty = function(label, value) {
        self.blankTreasure().weaponProperty(value);
    };

    /* Modal Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self.addModalFinishedClosing = function() {
        self.blankTreasure(null);
        self.shouldShowDisclaimer(false);
    };

    self.modalFinishedOpening = function() {

    };

    self.modalFinishedClosing = function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            self.treasure().forEach(function(item, idx, _) {
                if (item.treasureType() === self.currentEditItem().treasureType() && item.__id === self.editItemIndex) {
                    item.importValues(self.currentEditItem().exportValues());
                }
            });
        }

        self.save();
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

    self._dataHasChanged = function() {
        var key = CoreManager.activeCore().uuid();
        var treasure = [];
        self.treasureTypes.forEach(function(type, idx, _){
            var result = PersistenceService.findByPredicates(type, [
                new KeyValuePredicate('encounterId', self.encounterId()),
                new KeyValuePredicate('characterId', key)
            ]);
            treasure = treasure.concat(result);
        });
        self.treasure(treasure);

        var section = PersistenceService.findByPredicates(TreasureSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new TreasureSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };
}

ko.components.register('treasure-section', {
    viewModel: TreasureSectionViewModel,
    template: template
});
