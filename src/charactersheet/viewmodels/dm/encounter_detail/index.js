import { CoreManager } from 'charactersheet/utilities';
import { EncounterSection } from 'charactersheet/models/dm/encounter_section';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';
import './index.css';


export function EncounterDetailViewModel({ encounter }) {
    var self = this;

    self.encounter = encounter;
    self.sections = ko.observableArray([]);
    self.openModal = ko.observable(false);

    /* Public Methods */

    self.load = async () => {
        self.encounter.subscribe(self._dataHasChanged);
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
        self.sections(self.encounter().sections());
    };
}

ko.components.register('encounter-detail', {
    viewModel: EncounterDetailViewModel,
    template: template
});
