import { WealthFormViewModel } from './form';
import { WealthViewModel } from './view';

import ko from 'knockout';
import template from './index.html';


ko.components.register('wealth', {
    template: template
});
