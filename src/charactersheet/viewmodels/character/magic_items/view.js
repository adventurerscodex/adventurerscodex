import { ACViewModel } from 'charactersheet/components/view-component';
import { MagicItem } from 'charactersheet/models';

import ko from 'knockout';
import template from './view.html';


class MagicItemDetailViewModel extends ACViewModel {

    generateBlank () {
        return new MagicItem();
    }

    async refresh() {
        this.entity().importValues(this.existingData.exportValues());
    }
}

ko.components.register('magic-item-detail-view', {
    viewModel: MagicItemDetailViewModel,
    template: template
});
