import {
  CoreManager,
  Notifications
} from 'charactersheet/utilities';

import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { SpellStats } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class SpellStatsFormViewModel  extends AbstractFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank() {
        return new SpellStats();
    }

    async refresh() {
        const key = CoreManager.activeCore().uuid();
        const stats = await SpellStats.ps.read({uuid: key});
        this.entity().importValues(stats.object.exportValues());
    }

    setSpellCastingAbility = (label, value) => {
        this.entity().castingAbility(label);
    };

    notify() { Notifications.spellStats.changed.dispatch(); }

    validation = {
        // Deep copy of properties in object
        ...SpellStats.validationConstraints.rules
    };
}

ko.components.register('spell-stats-form', {
    viewModel: SpellStatsFormViewModel,
    template: template
});
