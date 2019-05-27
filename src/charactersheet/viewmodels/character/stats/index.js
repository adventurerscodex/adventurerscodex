import { StatsCardViewModel } from './view';
import { StatsHealthFormViewModel } from './form';

import icon from 'images/nested-hearts.svg';
import ko from 'knockout';
import template from './index.html';

class ACCardModel {
    constructor(params) {
        this.containerId = params.containerId;
        this.showBack = params.showBack;
        this.resize = params.resize;
        this.flip = params.flip;
    }
}

ko.components.register('stats', {
    viewModel: ACCardModel,
    template: template
});
