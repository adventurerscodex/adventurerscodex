import { CoreManager } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { EncounterSection } from 'charactersheet/models/dm/encounter_section';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';


export function EncounterDetailViewModel({ encounter }) {
    var self = this;

    self.encounter = encounter;
    self.openModal = ko.observable(false);
    self.sectionTypes = [];

    /**
     * The modal's done button has been clicked. Save the results and
     * notify the subscribers.
     */
    self.notifySections = (encounter) => {
        encounter.ps.save();
        Notifications.encounters.changed.dispatch();
    };

    /* UI Methods */

    self.toggleModal = () => {
        self.openModal(!self.openModal());
    };
}

ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});
