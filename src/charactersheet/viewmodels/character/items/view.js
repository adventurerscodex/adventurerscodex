import { ACViewModel } from 'charactersheet/components/view-component';
import { CardFlipButton } from 'charactersheet/components/card-flip-button';
import { Item } from 'charactersheet/models';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class ItemDetailViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
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
