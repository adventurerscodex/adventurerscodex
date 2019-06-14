import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class MagicItemDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelName = 'MagicItem';
}

ko.components.register('magic-item-detail-view', {
    viewModel: MagicItemDetailViewModel,
    template: template
});
