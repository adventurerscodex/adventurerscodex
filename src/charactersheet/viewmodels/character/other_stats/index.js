import { OtherStatsFormViewModel } from './form';
import { OtherStatsViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

class ACCardModel {
    constructor(params) {
        this.tabId = params.tabId;
        this.containerId = params.containerId;
        this.showForm = params.showForm;
        this.resize = params.resize;
        this.flip = params.flip;
    }
}

ko.components.register('other-stats', {
    viewModel: ACCardModel,
    template: template
});
