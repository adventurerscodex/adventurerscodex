import {
    CoreManager,
    DataRepository,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { debounce, filter } from 'lodash';

import { ACViewModel } from 'charactersheet/components/view-component';
import { Weapon } from 'charactersheet/models';
import ko from 'knockout';
import template from './view.html';


class WeaponDetailViewModel extends ACViewModel {

    generateBlank () {
        return new Weapon();
    }

    async refresh() {
        this.entity().importValues(this.existingData.exportValues());
        this.entity().updateHitBonusLabel();
    }
}

ko.components.register('weapon-detail-view', {
    viewModel: WeaponDetailViewModel,
    template: template
});
