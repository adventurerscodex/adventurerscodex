import { ProfileFormViewModel } from './form';
import { ProfileViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

ko.components.register('profile', {
    template: template
});
