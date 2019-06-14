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

    modelClass = () => {
        // You may be wondering where Ability Scores are. Since they are part
        // of the Saving Throw, it is expedient to get it from there, and simplifies
        // the view and form designs to do so.
        return SavingThrow;
    }

    refresh = async () => {
        await super.refresh();
        await this.updateSavingThrowValues();
    };

    updateSavingThrowValues = async () => {
        // By telling each savingThrow to update their labels, we're implicitly
        // making a networking call. This should not be this way, but because
        // the fix is too time consuming, at time of writing, I'm just leaving
        // it and documenting the weirdness.
        const saveUpdates = this.entities().map(async (savingThrow) => {
            await savingThrow.updateAbilityScore();
        });
        await Promise.all(saveUpdates);
    };

    setUpSubscriptions() {
        super.setUpSubscriptions();
        // abilityScore changes not needed, as the card flip should be enough
        // Notifications.abilityScores.changed.add(this.updateSavingThrowValues);
        Notifications.proficiencyBonus.changed.add(this.updateSavingThrowValues);
        Notifications.abilityScores.changed.add(this.updateSavingThrowValues);

    }

    findSaveByName = (name) => find(this.entities(), (savingthrow) => savingthrow.name() === name);
}

ko.components.register('ability-scores-saving-throws-view', {
    viewModel: ScoreSaveViewModel,
    template: template
});
