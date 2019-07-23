import { BackgroundFormViewModel } from './form';
import { BackgroundViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

ko.components.register('background', {
    template: template
});
