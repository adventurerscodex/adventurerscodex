import { AbstractTabularViewModel,
  calculateTotalLoad,
  calculateTotalValue
 } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { WeaponDetailViewModel } from './view';
import { WeaponFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class WeaponsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-weapon';
        this.collapseAllId = '#weapon-pane';
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

    refresh = async () => {
        await super.refresh();
        this.entities().forEach(function(e, i, _) {
            e.updateHitBonusLabel();
        });
    };

    addToList (params) {
        params.updateHitBonusLabel();
        super.addToList(params);
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        Notifications.abilityScores.changed.add(this.refresh);
        Notifications.stats.changed.add(this.refresh);
        Notifications.proficiencyBonus.changed.add(this.refresh);
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
