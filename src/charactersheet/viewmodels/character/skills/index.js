import { SkillsFormViewModel } from './form';
import { SkillsViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

ko.components.register('skills', {
    template: template
});
