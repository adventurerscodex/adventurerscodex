import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
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
        var key = CharacterManager.activeCharacter().key();
        var notes = PersistenceService.findByPredicates(NotesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
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
        var key = CharacterManager.activeCharacter().key();
        var notes = PersistenceService.findByPredicates(NotesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (notes) {
            notes.notes(self.notes());
            notes.visible(self.visible());

            notes.save();
        }
    };

    self.delete = function() {
        var key = CharacterManager.activeCharacter().key();
        var notes = PersistenceService.findByPredicates(NotesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        notes.delete();
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var notesSection = PersistenceService.findByPredicates(NotesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
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
