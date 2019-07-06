import {
  AbstractGridViewModel
 } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import { filter } from 'lodash';
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

    bonusLabel ( bonus ) {
        const bonusNumber = parseInt(ko.utils.unwrapObservable(bonus));
        let str = '+ 0';
        if (!isNaN(bonusNumber)) {
            str = bonusNumber >= 0 ? `+ ${bonusNumber}` : `- ${Math.abs(bonusNumber)}`;
        }
        return str;
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.abilityscore.changed.add(this.updateAbilityScoreValues));
    }

    async updateAbilityScoreValues (abilityScore) {
        if (abilityScore) {
            const skillUpdates = filter(
          this.entities(),
          (skill) => {
              return skill.abilityScore().uuid() === abilityScore.uuid();
          } ).map(async (skill) => {
              const updatedSkill = await skill.updateAbilityScoreValues(abilityScore);
              this.replaceInList(skill);
          });
            await Promise.all(skillUpdates);
        }
    }
}

ko.components.register('skills-view', {
    viewModel: SkillsViewModel,
    template: template
});
