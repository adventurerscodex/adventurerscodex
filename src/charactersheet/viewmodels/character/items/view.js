import { ACViewModel } from 'charactersheet/components/view-component';
import { Item } from 'charactersheet/models';

import ko from 'knockout';
import template from './view.html';


class ItemDetailViewModel extends ACViewModel {

    generateBlank () {
        return new Item();
    }

    async refresh() {
        this.entity().importValues(this.existingData.exportValues());
    }
}

ko.components.register('item-detail-view', {
    viewModel: ItemDetailViewModel,
    template: template
});
