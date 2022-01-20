import 'select2/dist/css/select2.min.css';
import 'bin/knockout-select2';
import {
    AbilityScore,
    Skill
} from 'charactersheet/models/character';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import {
    ProficiencyTypeComponentViewModel
} from 'charactersheet/components/proficiency-marker';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';
import template from './addForm.html';

export class SkillsAddFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        this.flipOnSave = params.flipOnSave;
        this.abilityScores = ko.observableArray([]);
        this.abilityScoreChoice = ko.observable('Strength');
        autoBind(this);
    }

    modelClass () {
        return Skill;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.show.subscribe(this.delayThenResize));
    }

    async refresh() {
        await super.refresh();
        const key = CoreManager.activeCore().uuid();
        const abilityScores = await AbilityScore.ps.list({
            coreUuid: key
        });
        this.abilityScores(abilityScores.objects);
    }


    async submit() {
        await super.submit();
        this.flipOnSave();
    }

    proficiencyOptions = [
        'not',
        'half',
        'proficient',
        'expertise'
    ];

    formatProficiencyOptions = (choice) => {
        if (choice.id === undefined) {
            return '';
        } else if (choice.id == 'not') {
            return $('<span style="padding: 10px">No Proficiency</span>');
        } else if (choice.id == 'expertise') {
            return $('<span style="padding: 10px"> ' + ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE + ' Expertise</span>');
        } else if (choice.id == 'proficient') {
            return $('<span style="padding: 10px"> ' + ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE + ' Proficient</span>');
        } else if (choice.id == 'half') {
            return $('<span style="padding: 10px"> ' + ProficiencyTypeComponentViewModel.HALF_TEMPLATE + ' Half</span>');
        } else return '';
    };

    formatProficiency = (choice) => {
        if (!choice.id) {
            return '';
        }
        if (choice.id == 'expertise') {
            return $(ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE);
        } else if (choice.id == 'proficient') {
            return $(ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE);
        } else if (choice.id == 'half') {
            return $(ProficiencyTypeComponentViewModel.HALF_TEMPLATE);
        } else return '';
    };

    abilityScoreOptions = () => this.abilityScores().map((score) => (score.name()));

    save = async () => {
        // HACKALERT: cannot figure out how to set objects in select2, so just
        // use a component value and update the value (to get around two way binding)
        const abilityScore = find(this.abilityScores(), (score) => (score.name() === this.abilityScoreChoice()));
        this.entity().abilityScore(abilityScore);
        await super.save();
    }

    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }

    didDelete(success, error) {
        super.didDelete(success, error);
        PartyService.updatePresence();
    }

    validation = {
        ...Skill.validationConstraints.fieldParams
    };
}

ko.components.register('skills-add-form-view', {
    viewModel: SkillsAddFormViewModel,
    template: template
});
