import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Feat } from 'charactersheet/models';
import { FeatFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class FeatsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-feat';
        this.collapseAllId = '#feat-pane';
        autoBind(this);
    }

    sorts() {
        return {
            ...super.sorts(),
            'isTracked asc': { field: 'isTracked', direction: 'asc'},
            'isTracked desc': { field: 'isTracked', direction: 'desc'}
        };
    }

    modelClass() {
        return Feat;
    }

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.feat.added.add(this.addToList));
        this.subscriptions.push(Notifications.feat.changed.add(this.replaceInList));
        this.subscriptions.push(Notifications.feat.deleted.add(this.removeFromList));
    }
}

ko.components.register('feats', {
    viewModel: FeatsViewModel,
    template: template
});
