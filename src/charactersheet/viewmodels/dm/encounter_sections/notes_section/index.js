import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { EncounterNote } from 'charactersheet/models/dm/encounter_sections';
import ko from 'knockout';
import sectionIcon from 'images/encounters/quill-ink.svg';
import template from './index.html';

export function NotesSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.notes = ko.observable('');
    self.visible = ko.observable();

    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!ko.unwrap(self.encounter)) { return; }
        return self.encounter().uuid();
    });

    self.name = 'Notes';
    self.tagline = ko.observable();

    //Public Methods
    self.load = function() {
        Notifications.encounters.changed.add(self._dataHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    self.saveNote = async () => {
        const noteResponse = await self.notes().ps.save();
        self.notes(noteResponse.object);
    };

    self.reset = async () => {
        var coreUuid = CoreManager.activeCore().uuid();
        const noteResponse = await EncounterNote.ps.read({coreUuid, uuid: self.encounterId()});
        self.notes(noteResponse.object);
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        await self.reset();

        var section = self.encounter().sections()[Fixtures.encounter.sections.notes.index];
        self.visible(section.visible());
        self.tagline(section.tagline());
    };
}

ko.components.register('notes-section', {
    viewModel: NotesSectionViewModel,
    template: template
});
