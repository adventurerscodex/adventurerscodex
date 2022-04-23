import ko from 'knockout';
import template from './index.html';

import './front';
import './back';

ko.components.register('media-manager', {
    template: template,
});
