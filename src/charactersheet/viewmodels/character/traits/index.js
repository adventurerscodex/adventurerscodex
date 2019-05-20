import { ACTableComponent } from 'charactersheet/components/table-component';
import { Notifications } from 'charactersheet/utilities';
import { Trait } from 'charactersheet/models';
import { TraitFormViewModel } from './form';
import ko from 'knockout';
import template from './index.html';


export class TraitsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-trait';
        this.collapseAllId = '#trait-pane';
    }

    modelClass = () => {
        return Trait;
    }

    sorts() {
        return {
            ...super.sorts(),
            'race asc': { field: 'race', direction: 'asc'},
            'race desc': { field: 'race', direction: 'desc'}
        };
    }

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        const traitChanged = Notifications.tracked.trait.changed.add(this.refresh);
        this.subscriptions.push(traitChanged);
    }
}

ko.components.register('traits', {
    viewModel: TraitsViewModel,
    template: template
});
