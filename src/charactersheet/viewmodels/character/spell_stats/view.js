import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { SpellStats } from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class SpellStatsViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    generateBlank () {
        return new SpellStats();
    }

    refresh = async () => {
        const key = CoreManager.activeCore().uuid();
        const stats = await SpellStats.ps.read({uuid: key});
        this.entity().importValues(stats.object.exportValues());
    };
}

ko.components.register('spell-stats-view', {
    viewModel: SpellStatsViewModel,
    template: template
});
