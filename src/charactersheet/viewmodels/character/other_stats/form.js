import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import {  Notifications } from 'charactersheet/utilities';

import { OtherStats } from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class OtherStatsFormViewModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return OtherStats;
    }

    toggleInspiration = async () => {
        this.entity().inspiration(!this.entity().inspiration());
    }
}

ko.components.register('other-stats-form', {
    viewModel: OtherStatsFormViewModel,
    template: template
});
