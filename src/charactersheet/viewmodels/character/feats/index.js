import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
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

    modelName = 'Feat';

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        const featChanged = Notifications.tracked.feat.changed.add(this.refresh);
        this.subscriptions.push(featChanged);
    }
}

ko.components.register('feats', {
    viewModel: FeatsViewModel,
    template: template
});
