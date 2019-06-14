import {
  AbstractViewModel
} from 'charactersheet/viewmodels/abstract';
import {
  CardEditActionComponent
} from 'charactersheet/components/card-edit-actions';
import { Weapon } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class WeaponDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank () {
        return new Weapon();
    }

    async refresh() {
        await super.refresh();
        this.entity().updateHitBonusLabel();
    }
}

ko.components.register('weapon-detail-view', {
    viewModel: WeaponDetailViewModel,
    template: template
});
