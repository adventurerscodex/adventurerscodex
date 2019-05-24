import 'bin/knockout-bootstrap-modal';
import {
    DataRepository,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { Weapon } from 'charactersheet/models/common';
import { WeaponDetailViewModel } from './view';
import { WeaponFormViewModel } from './form';

import ko from 'knockout';
import template from './index.html';

// name = ko.observable('');
// type = ko.observable('');
// damage = ko.observable('');
// damageType = ko.observable('');
// handedness = ko.observable('');
// proficiency = ko.observable('');
// price = ko.observable(0);
// currencyDenomination = ko.observable('');
// magicalModifier = ko.observable(0);
// toHitModifier = ko.observable(0);
// weight = ko.observable(1);
// range = ko.observable('');
// property = ko.observable('');
// description = ko.observable('');
// quantity = ko.observable(1);
// hitBonusLabel = ko.observable();

export class WeaponsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-weapon';
        this.collapseAllId = '#weapon-pane';

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
