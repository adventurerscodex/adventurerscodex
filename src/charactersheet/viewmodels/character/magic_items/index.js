import {
  AbstractTabularViewModel,
  calculateTotalLoad
 } from 'charactersheet/viewmodels/abstract';
import { MagicItemFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class MagicItemsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-magic-item';
        this.collapseAllId = '#magic-item-pane';
        autoBind(this);
    }

    modelName = 'MagicItem';

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
        await data.save();
    };

    numberOfAttuned = ko.pureComputed(() => {
        const attuned = ko.utils.arrayFilter(this.entities(), function(item) {
            return ko.utils.unwrapObservable(item.attuned) === true;
        });
        return attuned.length;
    });

    totalWeight = ko.pureComputed(() => {
        return calculateTotalLoad(this.entities());
    });
}

ko.components.register('magic-items', {
    viewModel: MagicItemsViewModel,
    template: template
});
