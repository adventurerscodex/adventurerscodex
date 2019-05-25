import { ACViewModel } from 'charactersheet/components/view-component';
import { CardFlipButton } from 'charactersheet/components/card-flip-button';
import { Weapon } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class WeaponDetailViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
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
