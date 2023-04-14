import {
    AbstractTabularViewModel,
    calculateTotalLoad,
    calculateTotalValue
} from 'charactersheet/viewmodels/abstract';
import { Item } from 'charactersheet/models/common';
import { ItemContainerViewModel } from './container';
import { ItemFormViewModel } from './form';
import { ItemViewModel } from './view';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class ItemsViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);
        this.addFormId = '#add-item';
        this.collapseAllId = '#item-pane';
        autoBind(this);
    }

    modelClass () {
        return Item;
    }

    sorts() {
        return {
            ...super.sorts(),
            'isContainer asc': { field: 'isContainer', direction: 'asc', numeric: true},
            'isContainer desc': { field: 'isContainer', direction: 'desc', numeric: true},
            'quantity asc': { field: 'quantity', direction: 'asc', numeric: true},
            'quantity desc': { field: 'quantity', direction: 'desc', numeric: true},
            'weight asc': { field: 'weight', direction: 'asc', numeric: true},
            'weight desc': { field: 'weight', direction: 'desc', numeric: true},
            'totalCalculatedWeight asc': { field: 'totalCalculatedWeight', direction: 'asc', numeric: true},
            'totalCalculatedWeight desc': { field: 'totalCalculatedWeight', direction: 'desc', numeric: true},
            'cost asc': { field: 'cost', direction: 'asc', numeric: true},
            'cost desc': { field: 'cost', direction: 'desc', numeric: true},
            'totalCalculatedCost asc': { field: 'totalCalculatedCost', direction: 'asc', numeric: true},
            'totalCalculatedCost desc': { field: 'totalCalculatedCost', direction: 'desc', numeric: true}
        };
    }

    totalCost = ko.pureComputed(() => (
        calculateTotalValue(this.entities(), 'totalCalculatedCost', null)
    ));

    totalWeight = ko.pureComputed(() => (
        calculateTotalLoad(this.entities(), 'totalWeight', null)
    ));

    contains(item) {
        return this.entities().find(e=>e.uuid() === item.uuid()) !== undefined;
    }

    parentOf(item) {
        return this.entities().find(e=>e.url() === item.parent());
    }

    addToList(item) {
        if (item && !item.hasParent()) {
            super.addToList(item);
        }
    }

    replaceInList(item) {
        if (item) {
            if (!item.hasParent()) {
                if (!this.contains(item)) {
                    this.addToList(item);
                } else {
                    super.replaceInList(item);
                }
            } else if (this.contains(item)) {
                this.removeFromList(item);
            }
        }
    }

    removeFromList(item) {
        if (this.contains(item)) {
            super.removeFromList(item);
        }
    }
}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});
