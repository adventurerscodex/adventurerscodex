import 'bin/popover_bind';
import 'select2/dist/css/select2.min.css';
import 'bin/knockout-select2';

import {
  AbilityScore,
  Skill
} from 'charactersheet/models/character';

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { ProficiencyTypeComponentViewModel } from 'charactersheet/components/proficiency-marker';

import {find } from 'lodash';
import ko from 'knockout';
import template from './addForm.html';

export class SkillsAddFormViewModel {
    constructor(params) {
        this.addSkillToView = params.addSkillToView;
        this.addForm = params.addForm;
        this.toggleaddForm = params.toggleaddForm;
        this.abilityScores = [];
        this.abilityScoreChoice = ko.observable('Strength');
        this.skill = ko.observable(new Skill());
        this.formElementHasFocus = ko.observable(false);
    }

    setUpSubscriptions = () => {
        this.addForm.subscribe(this.reset);
    }

    async load() {
        const key = CoreManager.activeCore().uuid();
        this.skill(new Skill());
        this.skill().coreUuid(key);
        const abilityScores = await AbilityScore.ps.list({coreUuid: key});
        this.abilityScores = abilityScores.objects;
        this.setUpSubscriptions();
    }

    reset = () => {
        if (this.addForm()) {
            this.formElementHasFocus(true);
        } else {
            this.formElementHasFocus(false);
        }
        const key = CoreManager.activeCore().uuid();
        this.skill(new Skill());
        this.skill().coreUuid(key);
        this.abilityScoreChoice = ko.observable('Strength');
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
        }
        else if (choice.id == 'expertise') {
            return $('<span style="padding: 10px"> '+ ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE + ' Expertise</span>');
        }
        else if (choice.id == 'proficient') {
            return $('<span style="padding: 10px"> '+ ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE + ' Proficient</span>');
        }
        else if (choice.id == 'half') {
            return $('<span style="padding: 10px"> '+ ProficiencyTypeComponentViewModel.HALF_TEMPLATE + ' Half</span>');
        }
      else return '';
    };

    formatProficiency = (choice) => {
        if (!choice.id) {
            return '';
        }
        if (choice.id == 'expertise') {
            return $(ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE);
        }
        else if (choice.id == 'proficient') {
            return $(ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE);
        }
        else if (choice.id == 'half') {
            return $(ProficiencyTypeComponentViewModel.HALF_TEMPLATE);
        }
      else return '';
    };

    abilityScoreOptions = () => this.abilityScores.map((score)=>(score.name()));

    submit = async () => {
        // HACKALERT: cannot figure out how to set objects in select2, so just
        // use a component value and update the value (to get around two way binding)
        const abilityScore = find(this.abilityScores, (score)=>(score.name() === this.abilityScoreChoice()));
        this.skill().abilityScore(abilityScore);

        const newSkillResponse = await this.skill().ps.create();
        const newSkill = newSkillResponse.object;
        await newSkill.updateBonuses();

        this.addSkillToView(newSkill);
        this.toggleaddForm();
    }

    cancel = () => {
        this.reset();
        this.toggleaddForm();
    }

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addSkill();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Skill.validationConstraints
    };
}

ko.components.register('skills-add-form-view', {
    viewModel: SkillsAddFormViewModel,
    template: template
});
