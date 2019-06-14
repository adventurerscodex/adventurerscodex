import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { CardEditActionComponent } from 'charactersheet/components/card-edit-actions';
import { MagicItem } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class MagicItemDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank () {
        return new MagicItem();
    }
}

ko.components.register('magic-item-detail-view', {
    viewModel: MagicItemDetailViewModel,
    template: template
});
