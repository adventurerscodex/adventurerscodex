import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import { randomWeather } from 'charactersheet/services';
import { Environment } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';


class EnvironmentFormViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.entity = params.entity;
        this.showElaboration = ko.observable(false);
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

    elaborationContext = ko.pureComputed(() => {
        const weatherDescription = (
            !!this.entity().weather()
            ? `The weather here is ${this.entity().weather()}. `
            : ''
        );
        const terrainDescription = (
            !!this.entity().terrain()
            ? `The terrain here is ${this.entity().terrain()}.`
            : ''
        );
        return weatherDescription + terrainDescription;
    });

    useElaboration(elaboration) {
        this.entity().description(elaboration.description());
        this.toggleElaboration();
    }

    toggleElaboration() {
        this.showElaboration(!this.showElaboration());
    }

    setRandomWeather() {
        this.entity().weather(randomWeather());
    }
}

ko.components.register('environment-form', {
    viewModel: EnvironmentFormViewModel,
    template: template
});
