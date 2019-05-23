import {
    CoreManager,
    DataRepository,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Spell, SpellStats } from 'charactersheet/models';
import { debounce, filter } from 'lodash';

import { ACViewModel } from 'charactersheet/components/view-component';
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
