import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import {  Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
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

    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }
}

ko.components.register('other-stats-form', {
    viewModel: OtherStatsFormViewModel,
    template: template
});
