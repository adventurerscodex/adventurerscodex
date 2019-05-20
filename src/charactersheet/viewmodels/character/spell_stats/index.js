import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import { SpellStatsFormViewModel } from './form';
import { SpellStatsViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

ko.components.register('spell-stats', {
    template: template
});
