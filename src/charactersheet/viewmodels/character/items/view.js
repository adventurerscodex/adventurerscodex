import { Item } from 'charactersheet/models/common';
import { Notifications } from 'charactersheet/utilities';
import {
    ModelBackedViewModel
} from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class ItemViewModel extends ModelBackedViewModel {

    constructor(params) {
        super(params);
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.modelClass.bind(this);
        autoBind(this);
    }

    modelClass() {
        return Item;
    }

    contains(item) {
        return this.entities().find(e=>e.uuid() === item.uuid()) !== undefined;
    }

    isTheParentOf(item) {
        return !!item.hasParent() && this.entity().url() === item.parent();
    }

    addToList(item) {
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

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.item.changed.add(this.updateEntity));
    }
}

ko.components.register('item-view', {
    viewModel: ItemViewModel,
    template: template
});
