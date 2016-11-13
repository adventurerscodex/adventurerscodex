'use strict';

function NotesSectionViewModel(parentEncounter, notesSection) {
    var self = this;

    self.notes = ko.observable('');

    /**
     * REQUIRED: Whether or not the given encounter section should be displayed.
     */
    self.visible = ko.observable(false);

    /**
     * REQUIRED: The template name relative to the encounter_sections.
     */
    self.template = 'notes_section.tmpl';

    /**
     * REQUIRED: The display name of the encounter section.
     */
    self.name = 'Notes';

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        Notifications.global.save.add(function() {
            self.save();
        });
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        if (!notesSection) {
            var notes = new NotesSection();
            notes.characterId(CharacterManager.activeCharacter().key());
            notes.encounterId(parentEncounter.encounterId());

            notes.save();
        } else {
            self.notes(notesSection.notes());
            self.visible(notesSection.visible());
        }
    };

    self.unload = function() {
        var notes = PersistenceService.findFirstBy(NotesSection,
            'encounterId', parentEncounter.encounterId());
        if (!notes) {
            notes = new NotesSection();
        }

        notes.notes(self.notes());
        notes.visible(self.visible());

        notes.save();
    };

    self.save = function() {
      var notes = PersistenceService.findFirstBy(NotesSection,
          'encounterId', parentEncounter.encounterId());
      if (notes) {
        notes.notes(self.notes());
        notes.visible(self.visible());

        notes.save();
      }
    };

    self.delete = function() {
        var notes = PersistenceService.findFirstBy(NotesSection,
            'encounterId', parentEncounter.encounterId());
        notes.delete();
    }
}
