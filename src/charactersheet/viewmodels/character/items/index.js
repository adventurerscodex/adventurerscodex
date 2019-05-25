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
            'cost asc': { field: 'cost', direction: 'asc', numeric: true},
            'cost desc': { field: 'cost', direction: 'desc', numeric: true}
        };
    }

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

ko.components.register('items', {
    viewModel: ItemsViewModel,
    template: template
});
