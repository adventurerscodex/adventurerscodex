'use strict';

function NotesSectionViewModel(parentEncounter) {
    var self = this;

    self.notes = ko.observable('');
    self.visible = ko.observable(false);

    self.template = 'notes_section.tmpl';
    self.encounterId = parentEncounter.encounterId;

    self.name = 'Notes';
    self.tagline = ko.observable();

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        Notifications.global.save.add(function() {
            self.save();
        });
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
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

    self.unload = function() {
        var notes = PersistenceService.findFirstBy(NotesSection, 'encounterId', self.encounterId());
        if (!notes) {
            notes = new NotesSection();
        }

        notes.notes(self.notes());
        notes.visible(self.visible());

        notes.save();
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
        if (notesSection) {
            self.notes(notesSection.notes());
            self.visible(notesSection.visible());
        }
    };
}
