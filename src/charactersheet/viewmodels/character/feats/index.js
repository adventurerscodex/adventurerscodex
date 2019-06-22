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
    modelName = 'Feat';
}

ko.components.register('feats', {
    viewModel: FeatsViewModel,
    template: template
});
