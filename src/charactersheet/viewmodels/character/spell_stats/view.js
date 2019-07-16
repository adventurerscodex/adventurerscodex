import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import { SpellStats } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './view.html';

class SpellStatsViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return SpellStats;
    }
}

ko.components.register('spell-stats-view', {
    viewModel: SpellStatsViewModel,
    template: template
});
