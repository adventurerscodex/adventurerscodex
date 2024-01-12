import './form';
import './view';

import ko from 'knockout';
import template from './index.html';

class CharacterPortraitModel {
    constructor(params) {
        this.containerId = params.containerId;
        this.showBack = params.showBack;
        this.resize = params.resize;
        this.flip = params.flip;
        this.show = ko.observable(true);
    }

    toggleShow() {
        this.show(!this.show());
    }
}

ko.components.register('dm-portrait', {
    viewModel: CharacterPortraitModel,
    template: template
});
