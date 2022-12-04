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
            'quantity asc': { field: 'quantity', direction: 'asc', numeric: true},
            'quantity desc': { field: 'quantity', direction: 'desc', numeric: true},
            'weight asc': { field: 'weight', direction: 'asc', numeric: true},
            'weight desc': { field: 'weight', direction: 'desc', numeric: true},
            'totalWeight asc': { field: 'totalWeight', direction: 'asc', numeric: true},
            'totalWeight desc': { field: 'totalWeight', direction: 'desc', numeric: true},
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

    addToList(item) {
        if (item && !ko.utils.unwrapObservable(item.hasParent)) {
            super.addToList(item);
        }
    }

    replaceInList(item) {
        if (item) {
            if (ko.utils.unwrapObservable(item.hasParent)) {
                super.removeFromList(item);
            } else if (!this.contains(item)) {
                super.addToList(item);
            } else {
                super.replaceInList(item);
            }
        }
    }

    removeFromList(item) {
        if (item && !ko.utils.unwrapObservable(item.hasParent)) {
            super.removeFromList(item);
        }
    }
}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});
