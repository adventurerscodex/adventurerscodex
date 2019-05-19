import { ACTableComponent } from 'charactersheet/components/table-component';
import { Feature } from 'charactersheet/models';
import { FeatureFormViewModel } from './form';
import ko from 'knockout';
import template from './index.html';


export class FeaturesViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-feature';
        this.collapseAllId = '#feature-pane';
        this.modelClass = Feature;
    }

    sorts() {
        return {
            ...super.sorts(),
            'characterClass asc': { field: 'characterClass', direction: 'asc'},
            'characterClass desc': { field: 'characterClass', direction: 'desc'}
        };
    }
}

ko.components.register('features', {
    viewModel: FeaturesViewModel,
    template: template
});
