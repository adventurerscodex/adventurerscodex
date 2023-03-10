import {
    AbstractTabularViewModel
} from 'charactersheet/viewmodels/abstract';
import { CoreManager, Notifications } from 'charactersheet/utilities';
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

    emptyContainer() {
        this.entities().map(this.removeFromContainer);
    }

    async removeFromContainer(item) {
        item.parent(null);
        await item.save();
        this.removeFromList(item);
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
        this.entities = this.entity().children;
    }

    sorts() {
        return {
            ...super.sorts(),
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

    collapseAll() {
        $(this.collapseAllId + ' .collapse.in').collapse('hide');
    }

    contains(item) {
        return this.entities().find(e=>e.uuid() === item.uuid()) !== undefined;
    }

    isTheParentOf(item) {
        return !!item.hasParent() && this.entity().url() === item.parent();
    }

    addToList(item) {
        console.log('ADD TO LIST', item)
        if (item && this.isTheParentOf(item)) {
            super.addToList(item);
            Notifications.item.changed.dispatch(this.entity());
        }
    }

    replaceInList(item) {
        if (!item) {
            return;
        }

        if (this.isTheParentOf(item)) {
            if (!this.contains(item)) {
                this.addToList(item);
            } else {
                super.replaceInList(item);
                Notifications.item.changed.dispatch(this.entity());
            }
        } else if (this.contains(item)) {
            this.removeFromList(item);
        }
    }

    removeFromList(item) {
        if (item && this.contains(item)) {
            super.removeFromList(item);
            Notifications.item.changed.dispatch(this.entity());
        }
    }

    async updateEntity(container) {
        if (container.uuid() == this.entity().uuid()) {
            this.refresh();
        }
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.item.changed.add(this.updateEntity));
    }
}


ko.components.register('item-container-view', {
    viewModel: ItemContainerViewModel,
    template: template
});
