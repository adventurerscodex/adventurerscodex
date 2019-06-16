import { AbstractGridViewModel } from 'charactersheet/viewmodels/abstract';
import {  Notifications } from 'charactersheet/utilities';
import { SavingThrow } from 'charactersheet/models/character';

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
    modelName = 'SavingThrow';

    async refresh () {
        await super.refresh();
        await this.updateSavingThrowValues();
    }

    async updateSavingThrowValues () {
        const saveUpdates = this.entities().map(async (savingThrow) => {
            await savingThrow.updateAbilityScore();
        });
        await Promise.all(saveUpdates);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        // abilityScore changes not needed, as the card flip should be enough
        Notifications.proficiencyBonus.changed.add(this.updateSavingThrowValues);
        Notifications.abilityScores.changed.add(this.updateSavingThrowValues);
    }

    findSaveByName = (name) => find(this.entities(), (savingthrow) => savingthrow.name() === name);
}

ko.components.register('ability-scores-saving-throws-view', {
    viewModel: ScoreSaveViewModel,
    template: template
});
