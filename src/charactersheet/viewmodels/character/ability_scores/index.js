import 'bin/knockout-bootstrap-modal';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { AbilityScoresViewModelDelegate } from 'charactersheet/viewmodels/character/ability_scores/delegate';
import { CoreManager } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';


export function AbilityScoresViewModel() {
    var self = this;

    self.delegate;
    self.abilityScores = ko.observableArray([]);
    self.modalStatus = ko.observable(false);
    self.editItems = ko.observableArray([]);
    self.firstModalElementHasFocus = ko.observable(false);
    self.addFormIsValid = ko.observable(false);

    self.load = async () => {
        self.delegate = new AbilityScoresViewModelDelegate();
        var key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid: key});
        self.abilityScores(response.objects);
    };

    // Modal Methods
    self.openModal = function() {
        // Copy existing array to new one
        self.editItems([]);
        self.abilityScores().forEach((score, i, _) => {
            let editScore = new AbilityScore();
            editScore.importValues(score.exportValues());
            self.editItems.push(editScore);
        });

        self.modalStatus(true);
         // Alert the modal even if the value didn't technically change.
        self.modalStatus.valueHasMutated();
    };

    self.modalFinishedAnimating = function() {
        // TODO: Since the form is dynamically generated, we have lost the ability to give a
        // TODO: specific field focus
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };

    self.modalFinishedClosing = async () => {
        if (self.modalStatus() && self.addFormIsValid()) {
            const response = await self.delegate.abilityScoresDidChange(
                self.abilityScores(),
                self.editItems()
            );
            self.abilityScores(response);
        }
        self.modalStatus(false);
    };

    // Validation
    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...AbilityScore.validationConstraints
    };

    self.closeModal = () => {
        self.modalStatus(false);
    };
}

ko.components.register('ability-scores', {
    viewModel: AbilityScoresViewModel,
    template: template
});
