import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class ArmorDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelName = 'Armor';
}

ko.components.register('armor-detail-view', {
    viewModel: ArmorDetailViewModel,
    template: template
});
