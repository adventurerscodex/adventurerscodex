import { ACViewModel } from 'charactersheet/components/view-component';
import { CardFlipButton } from 'charactersheet/components/card-flip-button';
import { MagicItem } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class MagicItemDetailViewModel extends ACViewModel {
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
