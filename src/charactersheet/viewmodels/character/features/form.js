import {
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';
import { Feature } from 'charactersheet/models';
import { TrackedFormController } from 'charactersheet/components/form-controller-tracked-component';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class FeatureFormViewModel  extends TrackedFormController {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank() {
        return new Feature();
    }
    classOptions = Fixtures.profile.classOptions;

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
            this.showDisclaimer(true);
            this.forceCardResize();
        }
    };

    populateClass = (label, value) => {
        this.entity().characterClass(value);
    };

    notify() { Notifications.feature.changed.dispatch(); }

    validation = {
        ...Feature.validationConstraints
    };


    popoverText = () => ('Tracked Features are listed in the Tracker.');
}

ko.components.register('feature-form', {
    viewModel: FeatureFormViewModel,
    template: template
});
