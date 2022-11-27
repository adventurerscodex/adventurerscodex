import {
    AbstractTabularViewModel,
    calculateTotalLoad,
    calculateTotalValue
} from 'charactersheet/viewmodels/abstract';
import { Item } from 'charactersheet/models/common';
import { ItemFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';

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
        calculateTotalValue(
            this.entities().flatMap(entity => (
                [entity, ...entity.children()]
            )),
            'cost'
        )
    ));

    totalWeight = ko.pureComputed(() => (
        calculateTotalLoad(this.entities(), 'totalWeight', null)
    ));

    // TODO: Add form should not add to main list if parent has value.

    // TODO: Fix sorting

    // TODO: Fix collapsing nested items

}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});
