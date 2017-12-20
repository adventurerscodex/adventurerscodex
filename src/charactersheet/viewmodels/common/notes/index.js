import 'bin/knockout-custom-loader';
import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { Note } from 'charactersheet/models/common';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

export function NotesViewModel() {
    var self = this;

    self.notes = ko.observableArray();
    self.selectedNote = ko.observable();

    self.load = function() {
        self.reloadData();

        Notifications.global.save.add(self.save);
        Notifications.notes.changed.add(self.reloadData);
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.notes().forEach(function(note, idx, _) {
            note.save();
        });
    };

    self.reloadData = function() {
        var key = CharacterManager.activeCharacter().key();
        var notes = PersistenceService.findBy(Note, 'characterId', key);
        if (notes.length > 0) {
            self.notes(notes);
            self.selectNote(self.notes()[0]);
        }
    };

    /* UI Methods */

    self.addNote = function() {
        var key = CharacterManager.activeCharacter().key();
        var note = new Note();
        note.characterId(key);
        note.save();
        self.notes.push(note);
        self.selectNote(note);
    };

    self.deleteNote = function(note) {
        self.notes.remove(note);
        note.delete();
        if (self.notes().length > 0) {
            self.selectNote(self.notes()[0]);
        } else {
            self.selectedNote(false);
        }
    };

    self.selectNote = function(note) {
        self.selectedNote(note);
        self.selectedNote().text.subscribe(self.selectedNote().save);
    };

    self.isActiveCSS = function(note) {
        return self.selectedNote() === note ? 'active' : '';
    };
}

ko.components.register('notes', {
    viewModel: NotesViewModel,
    template: template
});