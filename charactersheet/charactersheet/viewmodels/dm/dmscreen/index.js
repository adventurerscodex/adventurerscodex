import ko from 'knockout';

import 'bin/knockout-custom-loader';

import template from './index.html';

export function DMScreenViewModel() {
    var self = this;
}

ko.components.register('dm-screen', {
    viewModel: DMScreenViewModel,
    template: template
});
