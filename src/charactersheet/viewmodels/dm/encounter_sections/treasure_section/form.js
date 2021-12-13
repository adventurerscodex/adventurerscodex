import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


ko.components.register('treasure-form', {
    template: template
});
