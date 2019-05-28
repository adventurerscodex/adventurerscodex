import { ACTableViewModel } from 'charactersheet/components/table-view-component';
import { Notifications } from 'charactersheet/utilities';
import { Skill } from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

export class SkillsViewModel extends ACTableViewModel {
    constructor(params) {
        super(params);
        this.flip = params.flip;
        this.show = params.show;
        autoBind(this);
    }

    sorts () {
        return {
            ...super.sorts(),
            'modifier asc': { field: 'modifier', direction: 'asc'},
            'modifier desc': { field: 'modifier', direction: 'desc'},
            'proficiency asc': { field: 'proficiency', direction: 'asc', booleanType: true},
            'proficiency desc': { field: 'proficiency', direction: 'desc', booleanType: true}
        };
    }

    modelClass = () => {
        return Skill;
    }

    refresh = async () => {
        await super.refresh();
        await this.updateValues();
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        Notifications.abilityScores.changed.add(this.refresh);
        Notifications.proficiencyBonus.changed.add(this.updateValues);
    }

    // loops through all the skills to calculate bonuses
    updateValues = async () => {
        const skillUpdates = this.entities().map((skill) => {
            skill.updateBonuses();
        });
        await Promise.all(skillUpdates);
    };
}

ko.components.register('skills-view', {
    viewModel: SkillsViewModel,
    template: template
});
