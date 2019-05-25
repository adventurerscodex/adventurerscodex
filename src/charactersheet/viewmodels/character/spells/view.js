import { ACViewModel } from 'charactersheet/components/view-component';
import { CardFlipButton } from 'charactersheet/components/card-flip-button';
import { Spell } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';


class SpellDetailViewModel extends ACViewModel {
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
