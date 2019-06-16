import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { SpellStats } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class SpellStatsFormViewModel  extends AbstractFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return SpellStats;
    }

    setSpellCastingAbility = (label, value) => {
        this.entity().castingAbility(label);
    };

    notify() { Notifications.spellStats.changed.dispatch(); }
}

ko.components.register('spell-stats-form', {
    viewModel: SpellStatsFormViewModel,
    template: template
});
