import 'bin/knockout-custom-loader';

import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { ACTableComponent } from 'charactersheet/components/table-component';
import { Note } from 'charactersheet/models/common';
import { NotesFormViewModel } from './form';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';



export class NotesListModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-note';
        this.collapseAllId = '#notes-pane';
        autoBind(this);
    }

    modelClass = () => {
        return Note;
    }

    async refresh () {
        await super.refresh();
        this.updateHeadlines();
    }

    getDefaultSort () {
        return this.sorts()['title asc'];
    }

    sorts() {
        return {
            'title asc': { field: 'title', direction: 'asc'},
            'title desc': { field: 'title', direction: 'desc'}
        };
    }

    updateHeadlines = () => {
        this.entities().forEach((note) => {
            if (!note.title() || note.title() === '') {
                note.updateTitleFromHeadline();
            }
        });
    };

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        // const featChanged = Notifications.tracked.feat.changed.add(this.refresh);
        // this.subscriptions.push(featChanged);
    }
}



//
// export function NotesListModel() {
//     var self = this;
//
//     self.notes = ko.observableArray();
//     self.selectedNote = ko.observable();
//     self.selectedNoteId = ko.observable();
//
//     self.load = async () => {
//         await self.reloadData();
//
//         Notifications.notes.changed.add(self.reloadData);
//     };
//
//     self.reloadData = async () => {
//         var key = CoreManager.activeCore().uuid();
//         const response = await Note.ps.list({coreUuid: key});
//         self.notes(response.objects);
//         if (self.notes().length > 0) {
//             self.selectNote(self.notes()[0]);
//             self.updateHeadlines();
//         }
//     };
//
//     /* UI Methods */
//
//     self.addNote = async function() {
//         var key = CoreManager.activeCore().uuid();
//         var note = new Note();
//         note.coreUuid(key);
//         const newNote = await note.ps.create();
//         self.notes.push(newNote.object);
//         self.selectNote(newNote.object);
//     };
//
//     self.noteToSelect = function(note) {
//         var previousNote = self.notes().indexOf(note) - 1;
//         if (previousNote === -1) {
//             previousNote = 0;
//         }
//
//         return previousNote;
//     };
//
//     self.deleteNote = async function(note) {
//         const selectNote = self.noteToSelect(note);
//         await note.ps.delete();
//         self.notes.remove(note);
//
//         if (self.notes().length > 0) {
//             self.selectNote(self.notes()[selectNote]);
//         } else {
//             self.selectedNote(false);
//         }
//     };
//
//     self.updateHeadlines = () => {
//         self.notes().forEach((note) => {
//             note.updateHeadline();
//         });
//     };
//
//     self.selectNote = function(note) {
//         self.selectedNote(note);
//         self.selectedNoteId(note.uuid());
//         self.selectedNote().updateHeadline();
//     };
//
//     self.updateSelectedNote = () => {
//         self.selectedNote().updateHeadline();
//     };
//
//     self.saveSelectedNote = async () => {
//         self.selectedNote().updateHeadline();
//         await self.selectedNote().ps.save();
//     };
//
//     self.isActiveCSS = function(note) {
//         return self.selectedNoteId() === note.uuid() ? 'active' : '';
//     };
// }

ko.components.register('notes-list', {
    viewModel: NotesListModel,
    template: template
});
