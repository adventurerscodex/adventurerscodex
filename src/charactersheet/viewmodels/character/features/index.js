import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Feature } from 'charactersheet/models';
import { FeatureFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class FeaturesViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-feature';
        this.collapseAllId = '#feature-pane';
        autoBind(this);
    }

    modelClass = () => {
        return Feature;
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
