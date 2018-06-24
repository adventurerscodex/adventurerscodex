import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Note } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function NotesViewModel() {
    var self = this;

    self.notes = ko.observableArray();
    self.selectedNote = ko.observable();

    self.load = async () => {
        await self.reloadData();

        Notifications.notes.changed.add(self.reloadData);
    };

    self.reloadData = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Note.ps.list({coreUuid: key});
        self.notes(response.objects);
        if (self.notes().length > 0) {
            self.selectNote(self.notes()[0]);
            self.updateHeadlines();
        }
    };

    /* UI Methods */

    self.addNote = async function() {
        var key = CoreManager.activeCore().uuid();
        var note = new Note();
        note.coreUuid(key);
        const newNote = await note.ps.create();
        self.notes.push(newNote.object);
        self.selectNote(newNote.object);
    };

    self.noteToSelect = function(note) {
        var previousNote = self.notes().indexOf(note) - 1;
        if (previousNote === -1) {
            previousNote = 0;
        }

        return previousNote;
    };

    self.deleteNote = async function(note) {
        const selectNote = self.noteToSelect(note);
        await note.ps.delete();
        self.notes.remove(note);

        if (self.notes().length > 0) {
            self.selectNote(self.notes()[selectNote]);
        } else {
            self.selectedNote(false);
        }
    };

    self.updateHeadlines = () => {
        self.notes().forEach((note) => {
            note.updateHeadline();
        });
    }

    self.selectNote = function(note) {
        self.selectedNote(note);
        self.selectedNote().contents.subscribe(self.updateSelectedNote);
        self.selectedNote().updateHeadline();
    };

    self.updateSelectedNote = () => {
        self.selectedNote().updateHeadline();
    };

    self.saveSelectedNote = async () => {
        self.selectedNote().updateHeadline();
        await self.selectedNote().ps.save();
    };

    self.isActiveCSS = function(note) {
        return self.selectedNote() === note ? 'active' : '';
    };
}

ko.components.register('notes', {
    viewModel: NotesViewModel,
    template: template
});