import { ACTableComponent } from 'charactersheet/components/table-component';
import { Proficiency } from 'charactersheet/models';
import { ProficiencyFormViewModel } from './form';
import ko from 'knockout';
import template from './index.html';


export class ProficienciesViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-proficiency';
        this.collapseAllId = '#proficiency-pane';
        this.modelClass = Proficiency;
    }

    sorts() {
        return {
            ...super.sorts(),
            'type asc': { field: 'type', direction: 'asc'},
            'type desc': { field: 'type', direction: 'desc'}
        };
    }
}

ko.components.register('proficiencies', {
    viewModel: ProficienciesViewModel,
    template: template
});
