import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import { Environment } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import template from './form.html';


class EnvironmentFormViewModel extends AbstractFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.encounter = params.encounter;
        this.entity = params.entity;
    }

    formIsValid = ko.observable(false);

    modelClass() {
        return Environment;
    }

    generateBlank() {
        const newEntity = super.generateBlank();
        newEntity.uuid(this.encounter().uuid());
        return newEntity;
    }

    async refresh() {
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            const coreKey = CoreManager.activeCore().uuid();
            const encounterId = this.encounter().uuid();
            await this.entity().load({coreUuid: coreKey, uuid: encounterId });
        }
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
