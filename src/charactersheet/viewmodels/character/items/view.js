import { Item } from 'charactersheet/models/common';
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
}

ko.components.register('item-view', {
    viewModel: ItemViewModel,
    template: template
});