
import {
  DataRepository,
  Fixtures
} from 'charactersheet/utilities';

import { Feature } from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';
import { TrackedFormController } from 'charactersheet/components/form-controller-tracked-component';

import ko from 'knockout';
import template from './form.html';

export class FeatureFormViewModel  extends TrackedFormController {
    generateBlank() {
        return new Feature();
    }
    classOptions = Fixtures.profile.classOptions;

    // Pre-pop methods
    featuresPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.features
                ? DataRepository.featuresDisplayNames
                : [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateFeature = (label, value) => {
        const feature = DataRepository.filterBy('features', 'displayName', label)[0];
        if (feature) {
            this.entity().importValues(feature);
            this.shouldShowDisclaimer(true);
            this.forceCardResize();
        }
    };

    populateClass = (label, value) => {
        this.entity().characterClass(value);
    };

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
        ...Feature.validationConstraints
    };


    popoverText = () => ('Tracked Features are listed in the Tracker.');
}

ko.components.register('feature-form', {
    viewModel: FeatureFormViewModel,
    template: template
});
