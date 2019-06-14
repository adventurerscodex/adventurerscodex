import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { Item } from 'charactersheet/models';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class ItemDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank () {
        return new Item();
    }
}

ko.components.register('item-detail-view', {
    viewModel: ItemDetailViewModel,
    template: template
});
