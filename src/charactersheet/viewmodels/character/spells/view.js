import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { Spell } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class SpellDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank () {
        return new Spell();
    }
}

ko.components.register('spell-detail-view', {
    viewModel: SpellDetailViewModel,
    template: template
});
