import { ACTableComponent } from 'charactersheet/components/table-component';
import { Feat } from 'charactersheet/models';
import { FeatFormViewModel } from './form';
import { Notifications } from 'charactersheet/utilities';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class FeatsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-feat';
        this.collapseAllId = '#feat-pane';
        autoBind(this);
    }

    modelClass = () => {
        return Feat;
    }

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
