import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { Trait } from 'charactersheet/models';
import { TraitFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class TraitsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-trait';
        this.collapseAllId = '#trait-pane';
        autoBind(this);
    }
    modelName = 'Trait';

    sorts() {
        return {
            ...super.sorts(),
            'race asc': { field: 'race', direction: 'asc' },
            'race desc': { field: 'race', direction: 'desc' }
        };
    }
}

ko.components.register('traits', {
    viewModel: TraitsViewModel,
    template: template
});
