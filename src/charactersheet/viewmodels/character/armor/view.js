import { ACViewModel } from 'charactersheet/components/view-component';
import { Armor } from 'charactersheet/models';
import { CardFlipButton } from 'charactersheet/components/card-flip-button';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class ArmorDetailViewModel extends ACViewModel {
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
