import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { Armor } from 'charactersheet/models';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class ArmorDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    generateBlank () {
        return new Armor();
    }
}

ko.components.register('armor-detail-view', {
    viewModel: ArmorDetailViewModel,
    template: template
});
