import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class WeaponDetailViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        this.weaponBonusLabel = params.weaponBonusLabel;
        autoBind(this);
    }
    modelName = 'Weapon';
}

ko.components.register('weapon-detail-view', {
    viewModel: WeaponDetailViewModel,
    template: template
});
