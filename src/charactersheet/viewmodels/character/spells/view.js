import { ACViewModel } from 'charactersheet/components/view-component';
import { Spell } from 'charactersheet/models';

import ko from 'knockout';
import template from './view.html';


class SpellDetailViewModel extends ACViewModel {

    generateBlank () {
        return new Spell();
    }

    async refresh() {
        this.entity().importValues(this.existingData.exportValues());
    }
}

ko.components.register('spell-detail-view', {
    viewModel: SpellDetailViewModel,
    template: template
});
