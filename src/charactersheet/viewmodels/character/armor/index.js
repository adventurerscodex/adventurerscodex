
import 'bin/knockout-bootstrap-modal';
import {
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { Armor } from 'charactersheet/models/common';
import { ArmorDetailViewModel } from './view';
import { ArmorFormViewModel } from './form';

import { filter } from 'lodash';
import ko from 'knockout';
import template from './index.html';

// name = ko.observable('');
// type = ko.observable('');
// damage = ko.observable('');
// damageType = ko.observable('');
// handedness = ko.observable('');
// proficiency = ko.observable('');
// price = ko.observable(0);
// currencyDenomination = ko.observable('');
// magicalModifier = ko.observable(0);
// toHitModifier = ko.observable(0);
// weight = ko.observable(1);
// range = ko.observable('');
// property = ko.observable('');
// description = ko.observable('');
// quantity = ko.observable(1);
// hitBonusLabel = ko.observable();

export class ArmorViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-armor';
        this.collapseAllId = '#armor-pane';

    }

    modelClass = () => {
        return Armor;
    }

    sorts() {
        return {
            ...super.sorts(),
            'equipped asc': { field: 'equipped', direction: 'asc', booleanType: true},
            'equipped desc': { field: 'equipped', direction: 'desc', booleanType: true},
            'type asc': { field: 'type', direction: 'asc'},
            'type desc': { field: 'type', direction: 'desc'},
            'armorClass asc': { field: 'armorClass', direction: 'asc', numeric: true},
            'armorClass desc': { field: 'armorClass', direction: 'desc', numeric: true}
        };
    }

    equipArmor = async (data, event) => {
        event.stopPropagation();
        data.equipped(!data.equipped());
        const response = await data.ps.save();
        this.replaceInList(response.object);
        Notifications.armor.changed.dispatch();
    };

    replaceInList = async (entity) => {
        await this.handleArmorChange(entity);
        super.replaceInList(entity);
    }

    addToList = async (entity) => {
        await this.handleArmorChange(entity);
        super.addToList(entity);
    }

    handleArmorChange = async (selectedItem) => {
        if (selectedItem.equipped()) {
            const allEquipped = filter(this.entities(), (armor) => (
            armor.equipped() && armor.isShield() === selectedItem.isShield() && armor.uuid() != selectedItem.uuid()
        ));
            const unequip = allEquipped.map(async (armor)=> {
                armor.equipped(false);
                await armor.ps.save();
                this.replaceInList(armor);
            });
            await Promise.all(unequip);
        }
    };

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
    }

    // notify = () => {
    //     Notifications.armor.changed.dispatch();
    // }

    totalWeight = ko.pureComputed(() => {
        if (this.entities().length === 0) {
            return '0 (lbs)';
        }
        const weightTotal = this.entities().map(
            armor => armor.weight()
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(weightTotal)} (lbs)`;
    });
}





// import 'bin/knockout-bootstrap-modal';
// import {
//     CoreManager,
//     DataRepository,
//     Fixtures,
//     Notifications,
//     Utility
// } from 'charactersheet/utilities';
// import { Armor } from 'charactersheet/models/common';
// import { SortService } from 'charactersheet/services/common';
// import ko from 'knockout';
// import template from './index.html';
//
// export function ArmorViewModel() {
//     var self = this;
//
//     self.blankArmor = ko.observable(new Armor());
//     self.armors = ko.observableArray([]);
//     self.modalOpen = ko.observable(false);
//     self.addModalOpen = ko.observable(false);
//     self.editItemIndex = null;
//     self.currentEditItem = ko.observable();
//     self.shouldShowDisclaimer = ko.observable(false);
//     self.previewTabStatus = ko.observable('active');
//     self.editTabStatus = ko.observable('');
//     self.firstModalElementHasFocus = ko.observable(false);
//     self.editFirstModalElementHasFocus = ko.observable(false);
//     self.addFormIsValid = ko.observable(false);
//     self.currencyDenominationList = ko.observableArray(Fixtures.general.currencyDenominationList);
//
//     self._addForm = ko.observable();
//     self._editForm = ko.observable();
//
//     self.sorts = {
//         'equipped asc': { field: 'equipped', direction: 'asc', booleanType: true},
//         'equipped desc': { field: 'equipped', direction: 'desc', booleanType: true},
//         'name asc': { field: 'name', direction: 'asc'},
//         'name desc': { field: 'name', direction: 'desc'},
//         'type asc': { field: 'type', direction: 'asc'},
//         'type desc': { field: 'type', direction: 'desc'},
//         'armorClass asc': { field: 'armorClass', direction: 'asc', numeric: true},
//         'armorClass desc': { field: 'armorClass', direction: 'desc', numeric: true}
//     };
//
//     self.filter = ko.observable('');
//     self.sort = ko.observable(self.sorts['name asc']);
//
//     self.load = async () => {
//         var key = CoreManager.activeCore().uuid();
//         const response = await Armor.ps.list({coreUuid: key});
//         self.armors(response.objects);
//
//         //Subscriptions
//         Notifications.abilityScores.changed.add(self.valueHasChanged);
//     };
//
//     self.armorEquippedLabel = function(armor) {
//         return armor.equipped() ? 'fa fa-check' : '';
//     };
//
//     self.totalWeight = ko.pureComputed(function() {
//         if (self.armors().length === 0) {
//             return '0 (lbs)';
//         }
//
//         const weightTotal = self.armors().map(
//             armor => armor.weight()
//         ).reduce(
//             (a, b) => a + b
//         );
//         return `~${Math.round(weightTotal)} (lbs)`;
//     });
//
//     self.equipArmorHandler = async (selectedItem, index) => {
//         if (selectedItem.equipped()) {
//             if (selectedItem.type() === 'Shield') {
//                 for (const item2 of self.armors()) {
//                     if (index != item2.uuid && item2.type() == 'Shield') {
//                         item2.equipped(false);
//                         await item2.ps.save();
//                     }
//                 }
//             } else {
//                 for (const item2 of self.armors()) {
//                     if (index != item2.uuid && item2.type() != 'Shield') {
//                         item2.equipped(false);
//                         await item2.ps.save();
//                     }
//                 }
//             }
//         }
//     };
//
//     // Pre-populate methods
//
//     self.setArmorType = function(label, value) {
//         self.blankArmor().type(value);
//     };
//
//     self.setArmorCurrencyDenomination = function(label, value) {
//         self.blankArmor().currencyDenomination(value);
//     };
//
//     self.setArmorStealth = function(label, value) {
//         self.blankArmor().stealth(value);
//     };
//
//     /* Modal Methods */
//
//     self.armorsPrePopFilter = function(request, response) {
//         var term = request.term.toLowerCase();
//         var keys = DataRepository.armors ? Object.keys(DataRepository.armors) : [];
//         var results = keys.filter(function(name, idx, _) {
//             return name.toLowerCase().indexOf(term) > -1;
//         });
//         response(results);
//     };
//
//     self.populateArmor = function(label, value) {
//         var armor = DataRepository.armors[label];
//
//         self.blankArmor().importValues(armor);
//         self.shouldShowDisclaimer(true);
//     };
//
//     self.modalFinishedOpening = function() {
//         self.shouldShowDisclaimer(false);
//         self.firstModalElementHasFocus(true);
//     };
//
//     self.modalFinishedClosing = async () => {
//         self.previewTabStatus('active');
//         self.editTabStatus('');
//         if (self.modalOpen() && self.addFormIsValid()) {
//             const response = await self.currentEditItem().ps.save();
//             Utility.array.updateElement(self.armors(), response.object, self.editItemIndex);
//             Notifications.armor.changed.dispatch();
//         }
//
//         self.equipArmorHandler(self.currentEditItem(), self.editItemIndex);
//         self.modalOpen(false);
//     };
//
//     self.selectPreviewTab = function() {
//         self.previewTabStatus('active');
//         self.editTabStatus('');
//     };
//
//     self.selectEditTab = function() {
//         self.editTabStatus('active');
//         self.previewTabStatus('');
//         self.editFirstModalElementHasFocus(true);
//     };
//
//     self.modifierHasFocus = ko.observable(false);
//
//     /**
//      * Filters and sorts the armors for presentation in a table.
//      */
//     self.filteredAndSortedArmors = ko.computed(function() {
//         return SortService.sortAndFilter(self.armors(), self.sort(), null);
//     });
//
//     /**
//      * Determines whether a column should have an up/down/no arrow for sorting.
//      */
//     self.sortArrow = function(columnName) {
//         return SortService.sortArrow(columnName, self.sort());
//     };
//
//     /**
//      * Given a column name, determine the current sort type & order.
//      */
//     self.sortBy = function(columnName) {
//         self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
//     };
//
//     self.toggleAddModal = () => {
//         self.addModalOpen(!self.addModalOpen());
//     };
//
//     // Manipulating armors
//     self.addArmor = async () => {
//         var armor = self.blankArmor();
//         armor.coreUuid(CoreManager.activeCore().uuid());
//         const newArmor = await armor.ps.create();
//
//         self.equipArmorHandler(newArmor.object, newArmor.object.uuid);
//         self.armors.push(newArmor.object);
//         self.blankArmor(new Armor());
//         Notifications.armor.changed.dispatch();
//     };
//
//     self.removeArmor = async (armor) => {
//         await armor.ps.delete();
//         self.armors.remove(armor);
//         Notifications.armor.changed.dispatch();
//     };
//
//     self.editArmor = function(armor) {
//         self.editItemIndex = armor.uuid;
//         self.currentEditItem(new Armor());
//         self.currentEditItem().importValues(armor.exportValues());
//         self.modalOpen(true);
//     };
//
//     self.closeEditModal = () => {
//         self.modalOpen(false);
//         self.selectPreviewTab();
//
//         // Let the validator reset the validation in the form.
//         $(self._editForm()).validate().resetForm();
//     };
//
//     self.closeAddModal = () => {
//         self.addModalOpen(false);
//
//         // Let the validator reset the validation in the form.
//         $(self._addForm()).validate().resetForm();
//     };
//
//     self.valueHasChanged = function() {
//         self.armors().forEach(function(e, i, _) {
//             e.updateValues();
//         });
//     };
//
//     // Validation
//     self.validation = {
//         submitHandler: (form, event) => {
//             event.preventDefault();
//             self.addArmor();
//             self.addModalOpen(false);
//         },
//         updateHandler: ($element) => {
//             self.addFormIsValid($element.valid());
//         },
//         // Deep copy of properties in object
//         ...Armor.validationConstraints
//     };
//
//     self.updateValidation = {
//         submitHandler: (form, event) => {
//             event.preventDefault();
//             self.modalFinishedClosing();
//         },
//         updateHandler: ($element) => {
//             self.addFormIsValid($element.valid());
//         },
//         // Deep copy of properties in object
//         ...Armor.validationConstraints
//     };
// }

ko.components.register('armor', {
    viewModel: ArmorViewModel,
    template: template
});
