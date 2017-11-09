import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { NotesSection } from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import sectionIcon from 'images/encounters/quill-ink.svg';
import template from './index.html';

export function NotesSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.notes = ko.observable('');
    self.visible = ko.observable(false);

    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!self.encounter()) { return; }
        return self.encounter().encounterId();
    });

    self.name = 'Notes';
    self.tagline = ko.observable();

    //Public Methods
    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    self.unload = function() {
        var notes = PersistenceService.findFirstBy(NotesSection, 'encounterId', self.encounterId());
        if (!notes) {
            notes = new NotesSection();
        }

        notes.notes(self.notes());
        notes.visible(self.visible());

        notes.save();
        Notifications.global.save.remove(self.save);
        Notifications.encounters.changed.remove(self._dataHasChanged);
    };

    self.save = function() {
        var notes = PersistenceService.findFirstBy(NotesSection, 'encounterId', self.encounterId());
        if (notes) {
            notes.notes(self.notes());
            notes.visible(self.visible());

            notes.save();
        }
    };

    self.delete = function() {
        var notes = PersistenceService.findFirstBy(NotesSection, 'encounterId', self.encounterId());
        notes.delete();
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        var notesSection = PersistenceService.findFirstBy(NotesSection, 'encounterId', self.encounterId());
        if (!notesSection) {
            notesSection = new NotesSection();
            notesSection.characterId(CharacterManager.activeCharacter().key());
            notesSection.encounterId(self.encounterId());
            notesSection.save();
        }
        self.notes(notesSection.notes());
        self.visible(notesSection.visible());
        self.tagline(notesSection.tagline());
    };
}

ko.components.register('notes-section', {
    viewModel: NotesSectionViewModel,
    template: template
});
