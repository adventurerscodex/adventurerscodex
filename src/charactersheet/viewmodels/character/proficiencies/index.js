import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { Proficiency } from 'charactersheet/models';
import { ProficiencyFormViewModel } from './form';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';


export class ProficienciesViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-proficiency';
        this.collapseAllId = '#proficiency-pane';
        autoBind(this);
    }

    modelClass () {
        return Proficiency;
    }

    sorts() {
        return {
            ...super.sorts(),
            'type asc': { field: 'type', direction: 'asc'},
            'type desc': { field: 'type', direction: 'desc'}
        };
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.proficiency.added.add(this.addToList));
        this.subscriptions.push(Notifications.proficiency.changed.add(this.replaceInList));
        this.subscriptions.push(Notifications.proficiency.deleted.add(this.removeFromList));
    }
}

ko.components.register('proficiencies', {
    viewModel: ProficienciesViewModel,
    template: template
});
