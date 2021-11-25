import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import { Environment } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './form.html';


class EnvironmentFormViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.entity = params.entity;
    }

    formIsValid = ko.observable(false);

    modelClass() {
        return Environment;
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.environment.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.environment.index;
        return this.encounter().sections()[index].tagline();
    });
}

ko.components.register('environment-form', {
    viewModel: EnvironmentFormViewModel,
    template: template
});
