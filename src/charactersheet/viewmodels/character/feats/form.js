import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import {
    DataRepository,
    Fixtures
} from 'charactersheet/utilities';

import {
    Feat
} from 'charactersheet/models';
import {
    TrackedFormController
} from 'charactersheet/components/form-controller-tracked-component';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class FeatFormViewModel extends TrackedFormController {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank() {
        return new Feat();
    }
    classOptions = Fixtures.profile.classOptions;

    // Pre-pop methods
    featsPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.feats ?
                Object.keys(DataRepository.feats) :
                [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateFeat = (label, value) => {
        const feat = DataRepository.feats[label];
        if (feat) {
            this.entity().importValues(feat);
            this.showDisclaimer(true);
            this.forceCardResize();
        }
    };

    popoverText = () => ('Tracked Feats are listed in the Tracker.');

    notify() {
        Notifications.feat.changed.dispatch();
    }

    validation = {
        ...Feat.validationConstraints
    };
}

ko.components.register('feat-form', {
    viewModel: FeatFormViewModel,
    template: template
});
