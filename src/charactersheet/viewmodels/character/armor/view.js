import { ACViewModel } from 'charactersheet/components/view-component';
import { Armor } from 'charactersheet/models';

import ko from 'knockout';
import template from './view.html';


class ArmorDetailViewModel extends ACViewModel {

    generateBlank () {
        return new Armor();
    }

    async refresh() {
        this.entity().importValues(this.existingData.exportValues());
    }
}

ko.components.register('armor-detail-view', {
    viewModel: ArmorDetailViewModel,
    template: template
});
