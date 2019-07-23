import { AbstractGridViewModel } from 'charactersheet/viewmodels/abstract';
import {  Notifications } from 'charactersheet/utilities';
import { SavingThrow } from 'charactersheet/models';

import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './view.html';

class ScoreSaveViewModel extends AbstractGridViewModel {
    constructor(params) {
        super(params);
        this.order = params.order;
        autoBind(this);
    }
    // You may be wondering where Ability Scores are. Since they are part
    // of the Saving Throw, it is expedient to get it from there, and simplifies
    // the view and form designs to do so.
    modelClass() {
        return SavingThrow;
    }
    modifierLabel = (bonus) => {
        let modifier = '+ 0';
        let bonusNumber = parseInt(bonus);
        if (bonusNumber && !isNaN(bonusNumber)) {
            if (bonusNumber < 0) {
                return `- ${Math.abs(bonusNumber)}`;
            }
            return `+ ${bonusNumber}`;
        }
        return '+ 0';
    }

    findSaveByName = (name) => find(this.entities(), (savingthrow) => savingthrow.name() === name);
}

ko.components.register('ability-scores-saving-throws-view', {
    viewModel: ScoreSaveViewModel,
    template: template
});
