import { AbstractTabularViewModel,
  calculateTotalLoad,
  calculateTotalValue
 } from 'charactersheet/viewmodels/abstract';
import { Notifications, Utility } from 'charactersheet/utilities';
import { filter, maxBy } from 'lodash';
import { AbilityScore } from 'charactersheet/models';
import { ProficiencyService } from 'charactersheet/services/character/proficiency_service';
import { WeaponFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class WeaponsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-weapon';
        this.collapseAllId = '#weapon-pane';
        this.abilityScores = ko.observableArray([]);
        autoBind(this);
    }
    modelName = 'Weapon';

    sorts() {
        return {
            ...super.sorts(),
            'totalBonus asc': { field: 'totalBonus', direction: 'asc', numeric: true},
            'totalBonus desc': { field: 'totalBonus', direction: 'desc', numeric: true},
            'damage asc': { field: 'damage', direction: 'asc'},
            'damage desc': { field: 'damage', direction: 'desc'},
            'range asc': { field: 'range', direction: 'asc'},
            'range desc': { field: 'range', direction: 'desc'},
            'damageType asc': { field: 'damageType', direction: 'asc'},
            'damageType desc': { field: 'damageType', direction: 'desc'},
            'property asc': { field: 'property', direction: 'asc'},
            'property desc': { field: 'property', direction: 'desc'},
            'quantity asc': { field: 'quantity', direction: 'asc'},
            'quantity desc': { field: 'quantity', direction: 'desc'}
        };
    }


    async refresh () {
        await super.refresh();
        const abilityScores = await AbilityScore.ps.list({ coreUuid: this.coreKey });
        this.abilityScores(abilityScores.objects);
    }

    weaponBonusLabel = (weapon) => {
        return ko.pureComputed(() => {
            // TODO: Only if the user is proficient
            const profBonus = ProficiencyService.sharedService().proficiency() || 0;
            const weaponBonus = weapon.totalBonus() || 0;
            const abilityModOptions = weapon.abilityModOptions();
            const abilityScoreOptions = filter(
              this.abilityScores(),
              (score)=>(abilityModOptions.includes(score.name()))
            );
            const weaponAbility = maxBy(
              abilityScoreOptions,
              (abilityScore) => abilityScore.value());
            const abilityBonus = weaponAbility.modifier() || 0;
            const toHit = parseInt(profBonus) + parseInt(weaponBonus) + parseInt(abilityBonus);
            if (toHit) {
                return toHit >= 0 ? `+ ${toHit}` : `- ${Math.abs(toHit)}`;
            } else {
                return '+ 0';
            }
        });
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        Notifications.abilityscore.changed.add(this.updateAbilityScore);
    }

    updateAbilityScore = async (score) => {
        Utility.array.updateElement(this.abilityScores(), score, ko.utils.unwrapObservable(score.uuid));
    }

    totalCost = ko.pureComputed(() => {
        return calculateTotalValue(this.entities());
    })

    totalWeight = ko.pureComputed(() => {
        return calculateTotalLoad(this.entities());
    });
}

ko.components.register('weapons', {
    viewModel: WeaponsViewModel,
    template: template
});
