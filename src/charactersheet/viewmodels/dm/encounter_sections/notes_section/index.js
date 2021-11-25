import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterNote } from 'charactersheet/models/dm/encounter_sections';
import ko from 'knockout';
import template from './index.html';
import './form';


class NotesSectionViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.column = parent.column;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
    }

    modelClass() {
        return EncounterNote;
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.notes.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.notes.index;
        return this.encounter().sections()[index].tagline();
    });

    // Events

    partyDidChange = (party) => {
        this._isConnectedToParty(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        this.markAsExhibited(exhibitUuid);
    };

    // Private

    markAsExhibited = (exhibitUuid) => {
        this.entity().isExhibited(
            this.entity().exhibitUuid() === exhibitUuid
        );
    }
}


ko.components.register('notes-section', {
    viewModel: NotesSectionViewModel,
    template: template
});
