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
        this.background = ko.observable();
    }
}

ko.components.register('character-portrait', {
    viewModel: CharacterPortraitModel,
    template: template
});
