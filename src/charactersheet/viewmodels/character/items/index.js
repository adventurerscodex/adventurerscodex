import { ACTableComponent } from 'charactersheet/components/table-component';
import { Item } from 'charactersheet/models/common';
import { ItemDetailViewModel } from './view';
import { ItemFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class ItemsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-item';
        this.collapseAllId = '#item-pane';
        autoBind(this);
    }

    modelClass = () => {
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

    totalCost = ko.pureComputed(() => {
        if (this.entities().length === 0) {
            return '0 (gp)';
        }
        const total = this.entities().map(entity => entity.totalCalculatedCost()
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(total)}(gp)`;
    });

    totalWeight = ko.pureComputed(() => {
        if (this.entities().length === 0) {
            return '0 (lbs)';
        }
        const total = this.entities().map(
            entity => entity.totalWeight()
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(total)} (lbs)`;
    });
}

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});
