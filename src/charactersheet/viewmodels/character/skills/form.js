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
import { SkillsAddFormViewModel } from './addForm';
import { SortService } from 'charactersheet/services/common';

import { find } from 'lodash';
import ko from 'knockout';
import template from './form.html';

class ACFormViewModel {
    constructor(params) {
        // Card Properties
        this.containerId = ko.utils.unwrapObservable(params.containerId);
        this.showBack = params.showBack;
        this.flip = params.flip;
        this.forceCardResize = params.forceCardResize;

        this.loaded = ko.observable(false);
        this.formElementHasFocus = ko.observable(false);
    }

    async load() {
        this.loaded(false);
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    async reset() {
        await this.refresh();
        this.flip();
    }

    async refresh() {
        throw('refresh must be defined by subclasses of ACFormViewModel');
    }

    async save() {
        throw('Save must be defined by subclasses of ACFormViewModel');
    }

    async notify() {
        throw('Notify must be defined by subclasses of ACFormViewModel');
    }

    async submit() {
        await this.save();
        this.notify();
        this.setUpSubscriptions();
        this.flip();
    }

    setUpSubscriptions() {
        this.showBack.subscribe(this.subscribeToShowForm);
    }

    subscribeToShowForm = () => {
        if (this.showBack()) {
            this.refresh();
            this.formElementHasFocus(true);
        } else {
            this.formElementHasFocus(false);
        }
    }
}

export class SkillsFormViewModel extends ACFormViewModel {
    constructor(params) {
        super(params);
        this.addForm = ko.observable(false);
        this.skills = ko.observableArray([]);
        this.sort = ko.observable(SkillsFormViewModel.sorts['name asc']);
    }

    static sorts = {
        'name asc': { field: 'name', direction: 'asc'},
        'name desc': { field: 'name', direction: 'desc'},
        'modifier asc': { field: 'modifier', direction: 'asc'},
        'modifier desc': { field: 'modifier', direction: 'desc'},
        'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
        'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
    };

    async load() {
        await super.load();
        // Subscriptions
        const key = CoreManager.activeCore().uuid();
        this.monitorSubscriptions();
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        // Fetch skills
        const response = await Skill.ps.list({coreUuid: key});
        this.skills(response.objects);
        this.updateValues();

        //const perception = find(this.skills(), (skill) => skill.name() === 'Perception');


        //     perception.bonusLabel.subscribe(self.perceptionHasChanged);
    }

    toggleaddForm = () => {
        if (this.addForm()) {
            this.addForm(false);
            $('#add-skill').collapse('hide');
            setTimeout(this.forceCardResize, 350);
        } else {
            $('#add-skill').collapse('show');
            this.addForm(true);
            setTimeout(this.forceCardResize, 350);
        }
    };

    updateSkill = async (skill) => {
        await skill.updateBonuses();
        skill.markedForSave(true);
    }

    monitorSubscriptions = () => {
        Notifications.abilityScores.changed.add(this.updateValues);
        Notifications.proficiencyBonus.changed.add(this.updateValues);
    }

    // loops through all the skills to calculate bonuses
    updateValues = () => {
        this.skills().forEach(function(skill) {
            skill.updateBonuses();
        });
    };

    /**
     * Filters and sorts the skills for presentation in a table.
     */
    filteredAndSortedSkills = ko.pureComputed(() => {
        return SortService.sortAndFilter(this.skills(), this.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    sortArrow = (columnName) => {
        return SortService.sortArrow(columnName, this.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    sortBy = (columnName) => {
        this.sort(SortService.sortForName(this.sort(),
            columnName, SkillsFormViewModel.sorts));
    };

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

    save = async () => {
        const updates = this.skills().map(async (skill) => {
            if (skill.markedForSave()) {
                await skill.ps.save();
                skill.markedForSave(false);
            }
        });
        await Promise.all(updates);
    }

    notify = () => {
        console.log('you forgot to notify when perception changes.');
        console.log('you forgot to notify when perception changes.');
    }

    addSkillToView = (skill) => {
        this.skills.push(skill);
    }
    removeSkill = async (skill) => {
        await skill.ps.delete();
        await this.refresh();
    };
}

ko.components.register('skills-form-view', {
    viewModel: SkillsFormViewModel,
    template: template
});
