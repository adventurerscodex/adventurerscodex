import {
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormController } from 'charactersheet/components/form-controller-component';
import { Proficiency } from 'charactersheet/models';

import ko from 'knockout';
import template from './form.html';

export class ProficiencyFormViewModel  extends FormController {
    generateBlank() {
        return new Proficiency();
    }
    proficiencyType = Fixtures.proficiency.proficiencyTypes;

    // Pre-pop methods
    proficienciesPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.proficiencies
                ? Object.keys(DataRepository.proficiencies)
                : [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateProficiency = (label, value) => {
        const proficiency = DataRepository.proficiencies[label];
        this.entity().importValues(proficiency);
        this.showDisclaimer(true);
    };

    setType = (label, value) => {
        this.entity().type(value);
    };

    notify() { Notifications.proficiency.changed.dispatch(); }

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addFeature();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Proficiency.validationConstraints
    };
}

ko.components.register('proficiency-form', {
    viewModel: ProficiencyFormViewModel,
    template: template
});
