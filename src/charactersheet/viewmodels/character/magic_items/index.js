import { ACTableComponent } from 'charactersheet/components/table-component';
import { MagicItem } from 'charactersheet/models/common';
import { MagicItemDetailViewModel } from './view';
import { MagicItemFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class MagicItemsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-magic-item';
        this.collapseAllId = '#magic-item-pane';
        autoBind(this);
    }

    modelClass = () => {
        return MagicItem;
    }

    sorts() {
        return {
            ...super.sorts(),
            'type asc': { field: 'type', direction: 'asc'},
            'type desc': { field: 'type', direction: 'desc'},
            'weight asc': { field: 'weight', direction: 'asc', numeric: true},
            'weight desc': { field: 'weight', direction: 'desc', numeric: true},
            'usedCharges asc': { field: 'usedCharges', direction: 'asc'},
            'usedCharges desc': { field: 'usedCharges', direction: 'desc'},
            'attuned asc': { field: 'attuned', direction: 'asc', booleanType: true},
            'attuned desc': { field: 'attuned', direction: 'desc', booleanType: true}
        };
    }

    attuneItem = async (data, event) => {
        event.stopPropagation();
        data.attuned(!data.attuned());
        const response = await data.ps.save();
        this.replaceInList(response.object);
        Notifications.magicItem.changed.dispatch();
    };

    numberOfAttuned = ko.pureComputed(() => {
        const attuned = ko.utils.arrayFilter(self.entities(), function(item) {
            return item.attuned() === true;
        });
        return attuned.length;
    });

    totalWeight = ko.pureComputed(() => {
        if (this.entities().length === 0) {
            return '0 (lbs)';
        }
        const weightTotal = this.entities().map(
            item => item.weight()
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(weightTotal)}(lbs)`;
    });
}

ko.components.register('magic-items', {
    viewModel: MagicItemsViewModel,
    template: template
});
