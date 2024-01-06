import autoBind from 'auto-bind';
import ko from 'knockout';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import { Environment } from 'charactersheet/models/dm/encounter_sections';
import { Utility } from 'charactersheet/utilities';
import template from './index.html';
import './form';
import './view';


class EnvironmentSectionViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.encounter = params.encounter;
    }

    fullScreen = ko.observable(false);

    modelClass() {
        return Environment;
    }

    // UI

    convertedImageLink = ko.pureComputed(() => {
        if (this.entity().imageUrl()) {
            return Utility.string.createDirectDropboxLink(this.entity().imageUrl());
        }
    });
}


ko.components.register('environment-section', {
    viewModel: EnvironmentSectionViewModel,
    template: template
});
