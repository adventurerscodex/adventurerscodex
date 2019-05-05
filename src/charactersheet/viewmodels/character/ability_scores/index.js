import 'bin/knockout-bootstrap-modal';
import { CoreManager, Notifications } from 'charactersheet/utilities';
import { filter, find, includes } from 'lodash';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { AbilityScoresViewModelDelegate } from 'charactersheet/viewmodels/character/ability_scores/delegate';
import { SavingThrow } from 'charactersheet/models/character';
import { ScoreSaveFormViewModel } from './form';
import ko from 'knockout';
import template from './index.html';

class ACViewModel {
    constructor(params) {
        this.tabId = params.tabId;
        this.loaded = ko.observable(false);
        this.data = {};
    }
    async load() {
        this.loaded(false);
        await this.refresh();
    }

    async reset() {
        await this.refresh();
    }
}

class AbilityScoresViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        this.delegate;
        this.abilityScores = ko.observableArray([]);
        this.savingThrows = ko.observableArray([]);

    }

    order = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma'
    ];

    load = async () => {
        await super.load();
        Notifications.abilityScores.changed.add(this.updateSavingThrowValues);
        Notifications.otherStats.proficiency.changed.add(this.updateSavingThrowValues);
    };

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const scores = await AbilityScore.ps.list({coreUuid: key});
        const saves = await SavingThrow.ps.list({coreUuid: key});
        this.abilityScores(scores.objects.map(score => ko.observable(score)));
        this.savingThrows(saves.objects.map(savingThrow => ko.observable(savingThrow)));

        // Calculate Initial Values
        this.updateSavingThrowValues();
    };

    updateSavingThrowValues = async () => {
        // By telling each savingThrow to update their labels, we're implicitly
        // making a networking call. This should not be this way, but because
        // the fix is too time consuming, at time of writing, I'm just leaving
        // it and documenting the weirdness.
        for (const savingThrow of this.savingThrows()) {
            await savingThrow().updateModifierLabel();
        }
        this.loaded(true);
    };

    findSaveByName = (name) => find(this.savingThrows(), (savingthrow) => savingthrow().name() === name);

    findScoreByName = (name) => find(this.abilityScores(), (score) => score().name() === name);

    save = async ({ notify, savingThrows, abilityScores }) => {
        savingThrows().map(async (savingThrow) => {
            // save each save in place.
            await savingThrow().ps.save();
        });
        abilityScores().map(async (abilityScore) => {
            // save each save in place.
            await abilityScore().ps.save();
        });

        notify();
    }
    reset = async ({ refresh }) => {
        refresh();
    }
    notify = () => {
        console.log('the changes!');
        Notifications.abilityScores.changed.dispatch();
    }
    // Modal Methods
    // self.openModal = function() {
    //     // Copy existing array to new one
    //     self.editItems([]);
    //     self.abilityScores().forEach((score, i, _) => {
    //         let editScore = new AbilityScore();
    //         editScore.importValues(score.exportValues());
    //         self.editItems.push(editScore);
    //     });
    //
    //     self.modalStatus(true);
    //      // Alert the modal even if the value didn't technically change.
    //     self.modalStatus.valueHasMutated();
    // };

    // self.modalFinishedAnimating = function() {
    //     // TODO: Since the form is dynamically generated, we have lost the ability to give a
    //     // TODO: specific field focus
    //     self.firstModalElementHasFocus(true);
    //     self.firstModalElementHasFocus.valueHasMutated();
    // };

    // self.modalFinishedClosing = async () => {
    //     if (self.modalStatus() && self.addFormIsValid()) {
    //         const response = await self.delegate.abilityScoresDidChange(
    //             self.abilityScores(),
    //             self.editItems()
    //         );
    //         self.abilityScores(response);
    //     }
    //     self.modalStatus(false);
    // };

    // Validation
    // self.validation = {
    //     submitHandler: (form, event) => {
    //         event.preventDefault();
    //         self.modalFinishedClosing();
    //     },
    //     updateHandler: ($element) => {
    //         self.addFormIsValid($element.valid());
    //     },
    //     // Deep copy of properties in object
    //     ...AbilityScore.validationConstraints
    // };
    //
    // self.closeModal = () => {
    //     self.modalStatus(false);
    // };
}

ko.components.register('ability-scores', {
    viewModel: AbilityScoresViewModel,
    template: template
});
