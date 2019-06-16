import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class ItemDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelName = 'Item';
}

ko.components.register('item-detail-view', {
    viewModel: ItemDetailViewModel,
    template: template
});
