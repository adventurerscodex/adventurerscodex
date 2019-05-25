import 'bin/knockout-bootstrap-modal';
import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { Weapon } from 'charactersheet/models/common';
import { WeaponDetailViewModel } from './view';
import { WeaponFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class WeaponsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-weapon';
        this.collapseAllId = '#weapon-pane';
        autoBind(this);
    }

    modelClass = () => {
        return Weapon;
    }

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
        if (this.entities().length === 0) {
            return '0 (gp)';
        }
        const calculateCost = (cost, coin) => {
            if (coin.toLowerCase() === 'cp') {
                return parseInt(cost)/100;
            } else if (coin.toLowerCase() === 'sp') {
                return parseInt(cost)/10;
            } else if (coin.toLowerCase() === 'ep') {
                return parseInt(cost)/2;
            } else if (coin.toLowerCase() === 'pp') {
                return parseInt(cost) * 10;
            }
            return cost;
        };

        const total = this.entities().map(
            entity => calculateCost(entity.price(), entity.currencyDenomination()) * parseInt(entity.quantity())
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(total)}(gp)`;
    })

    totalWeight = ko.pureComputed(() => {
        if (this.entities().length === 0) {
            return '0 (lbs)';
        }
        const weightTotal = this.entities().map(
            weapon => weapon.totalWeight()
        ).reduce(
            (a, b) => a + b
        );
        return `~${Math.round(weightTotal)} (lbs)`;
    });
}

ko.components.register('weapons', {
    viewModel: WeaponsViewModel,
    template: template
});
