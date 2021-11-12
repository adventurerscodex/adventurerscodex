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

    // Events

    partyDidChange(party) {
        self._isConnectedToParty(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        self.markAsExhibited(exhibitUuid);
    };

    // Private

    markAsExhibited(exhibitUuid) {
        self.environment().isExhibited(
            self.environment().exhibitUuid() === exhibitUuid
        );
    }
}

ko.components.register('environment-form', {
    viewModel: EnvironmentFormViewModel,
    template: template
});
