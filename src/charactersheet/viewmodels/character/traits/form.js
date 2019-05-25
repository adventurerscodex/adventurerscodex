import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import {
  DataRepository,
  Fixtures
} from 'charactersheet/utilities';

import { TrackedFormController } from 'charactersheet/components/form-controller-tracked-component';
import { Trait } from 'charactersheet/models';

import ko from 'knockout';
import template from './form.html';

export class TraitFormViewModel  extends TrackedFormController {
    generateBlank() {
        return new Trait();
    }
    raceOptions = Fixtures.profile.raceOptions;


    raceOptions = Fixtures.profile.raceOptions;

    // Pre-pop methods
    traitsPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.traits
                ?  Object.keys(DataRepository.traits)
                : [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateRace = (label, value) => {
        this.entity().race(value);
    };

    populateTrait = (label, value) => {
        var trait = DataRepository.traits[label];
        if (trait) {
            this.entity().importValues(trait);
            this.showDisclaimer(true);
            this.forceCardResize();
        }
    };

    popoverText = () => ('Tracked Traits are listed in the Tracker.');



    notify() { Notifications.feature.changed.dispatch(); }

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addFeature();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Trait.validationConstraints
    };
}

ko.components.register('trait-form', {
    viewModel: TraitFormViewModel,
    template: template
});
