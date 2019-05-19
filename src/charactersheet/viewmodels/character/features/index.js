import { ACTableComponent } from 'charactersheet/components/table-component';
import { Feature } from 'charactersheet/models';
import { FeatureFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';
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

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        const featureChanged = Notifications.tracked.feature.changed.add(this.refresh);
        this.subscriptions.push(featureChanged);
    }
}

ko.components.register('features', {
    viewModel: FeaturesViewModel,
    template: template
});
