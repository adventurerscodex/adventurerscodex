import 'bin/popover_bind';
import { AbilityScore, SavingThrow } from 'charactersheet/models/character';
import { AbstractGridFormModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './form.html';

export class ScoreSaveFormViewModel extends AbstractGridFormModel {
    constructor(params) {
        super(params);
        this.order = params.order;
        this.showSaves = ko.observable(false);
        autoBind(this);
    }

    modelClass = () => {
        return SavingThrow;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.show.subscribe(this.resetShowSaves));
    }

    resetShowSaves () {
        if (!this.show()) {
            this.showSaves(false);
        }
    }

    saveFormHasFocus = ko.pureComputed(()=>(this.formElementHasFocus() && this.showSaves()));
    scoreFormHasFocus = ko.pureComputed(()=>(this.formElementHasFocus() && !this.showSaves()));

    toggleSaves = (newValue) => {
        this.showSaves(!this.showSaves());
        this.forceCardResize();
    };

    findSaveByName = (name) => find(this.entities(), (savingthrow) => savingthrow.name() === name);

    async save () {
        const updates = this.entities().map(async (entity) => {
            if (entity.abilityScore().markedForSave) {
                delete entity.abilityScore().markedForSave;
                await entity.abilityScore().save();
            }
            if (entity.markedForSave) {
                delete entity.markedForSave;
                await entity.save();
            }
        });
        await Promise.all(updates);

        PartyService.updatePresence();
    }

    validation = {
        'AbilityScore': {
            ...AbilityScore.validationConstraints.fieldParams
        },
        'SavingThrow': {
            ...SavingThrow.validationConstraints.fieldParams
        }
    }
}

ko.components.register('score-save-form', {
    viewModel: ScoreSaveFormViewModel,
    template: template
});
