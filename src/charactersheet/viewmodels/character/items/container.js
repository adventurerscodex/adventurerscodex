import {
    AbstractTabularViewModel
} from 'charactersheet/viewmodels/abstract';
import { CoreManager } from 'charactersheet/utilities';
import { Item } from 'charactersheet/models/common';
import { SortService } from 'charactersheet/services/common';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './container.html';


const noOp = () => {};

export class ItemContainerViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        // this.collapseAllId = '#items-pane';
        this.existingData = params.data ? params.data : null;
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.collapseAllId = `.${this.containerId}`;
        this.entity = ko.observable();
        this.modelClass.bind(this);
        autoBind(this);
    }

    modelClass() {
        return Item;
    }

    generateBlank() {
        const thisClazz = this.modelClass();
        const newEntity = new thisClazz();
        const coreKey = CoreManager.activeCore().uuid();
        newEntity.coreUuid(coreKey);
        return newEntity;
    }

    async load() {
        this.entity(this.generateBlank());
        await this.refresh();
        await super.load();
        if (this.containerId) {
            $(`#${this.containerId}`).on('hidden.bs.collapse', this.collapseAll);
    
        }
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            const coreKey = CoreManager.activeCore().uuid();
            await this.entity().load({uuid: coreKey});
        }
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

    filteredAndSortedEntities = ko.pureComputed(
        () => SortService.sortAndFilter(
            this.entity().children(),
            this.sort(),
            null)
    );

    collapseAll() {
        $(this.collapseAllId + ' .collapse.in').collapse('hide');
    }

}


ko.components.register('item-container-view', {
    viewModel: ItemContainerViewModel,
    template: template
});