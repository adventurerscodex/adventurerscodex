import {
  AbstractGridViewModel
 } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class SkillsViewModel extends AbstractGridViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelName = 'Skill';

    sorts () {
        return {
            ...super.sorts(),
            'modifier asc': { field: 'modifier', direction: 'asc'},
            'modifier desc': { field: 'modifier', direction: 'desc'},
            'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
            'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
        };
    }

    async refresh () {
        await super.refresh();
        await this.updateValues();
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        Notifications.abilityScores.changed.add(this.refresh);
        Notifications.proficiencyBonus.changed.add(this.updateValues);
    }

    // loops through all the skills to calculate bonuses
    async updateValues () {
        const skillUpdates = this.entities().map((skill) => {
            skill.updateBonuses();
        });
        await Promise.all(skillUpdates);
    }
}

ko.components.register('skills-view', {
    viewModel: SkillsViewModel,
    template: template
});
