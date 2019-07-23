import {
  AbstractTabularViewModel,
  calculateTotalLoad,
  calculateTotalValue
 } from 'charactersheet/viewmodels/abstract';
import { Armor } from 'charactersheet/models';
import { ArmorFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import { filter } from 'lodash';
import ko from 'knockout';
import template from './index.html';

export class ArmorViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-armor';
        this.collapseAllId = '#armor-pane';
        autoBind(this);
    }

    modelClass() {
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
        await data.save();
    };

    handleArmorChange = async (selectedItem) => {
        if (selectedItem.equipped()) {
            const allEquipped = filter(this.entities(), (armor) => (
            armor.equipped() && armor.isShield() === selectedItem.isShield() && armor.uuid() != selectedItem.uuid()
        ));
            const unequip = allEquipped.map(async (armor)=> {
                armor.equipped(false);
                await armor.save();
                this.replaceInList(armor);
            });
            await Promise.all(unequip);
        }
    };

    setUpSubscriptions () {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.armor.added.add(this.addToList));
        this.subscriptions.push(Notifications.armor.changed.add(this.replaceInList));
        this.subscriptions.push(Notifications.armor.deleted.add(this.removeFromList));
        this.subscriptions.push(Notifications.armor.added.add(this.handleArmorChange));
        this.subscriptions.push(Notifications.armor.changed.add(this.handleArmorChange));

    }
    totalCost = ko.pureComputed(() => {
        return calculateTotalValue(this.entities());
    });


    totalWeight = ko.pureComputed(() => {
        return calculateTotalLoad(this.entities());
    })
}

ko.components.register('armor', {
    viewModel: ArmorViewModel,
    template: template
});
