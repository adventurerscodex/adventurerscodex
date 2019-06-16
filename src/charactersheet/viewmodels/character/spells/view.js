import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class SpellDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelName = 'Spell';
}

ko.components.register('spell-detail-view', {
    viewModel: SpellDetailViewModel,
    template: template
});
