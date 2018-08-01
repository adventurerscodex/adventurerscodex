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
    self.sections = ko.observableArray([]);
    self.openModal = ko.observable(false);
    self.sectionTypes = [];

    /* Public Methods */

    self.load = async () => {
        self.encounter.subscribe(self._dataHasChanged);

        self.sectionTypes = await EncounterSection.ps.list();
        self._dataHasChanged();
    };

    /**
     * The modal's done button has been clicked. Save the results and
     * notify the subscribers.
     */
    self.modalDidFinish = async (encounter) => {
        await encounter.ps.save();
        Notifications.encounters.changed.dispatch();
    };

    /* UI Methods */

    self.toggleModal = () => {
        self.openModal(!self.openModal());
    };

    self._dataHasChanged = () => {
        if (!ko.unwrap(self.encounter)) {
            return;
        }
        var key = CoreManager.activeCore().uuid();
        self.sections(self.encounter().sections());
    };
}

ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});
