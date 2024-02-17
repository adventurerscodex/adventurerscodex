import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Note } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

const DELETE_CONFIRM_MESSAGE = `You are About to Delete a Note.


This will permanently delete all data associated with this note. This action cannot be undone.

Click Ok to delete this Note.`;

export class NotesFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass () {
        return Note;
    }

    async save() {
        if (!this.entity().title() || this.entity().title().trim() === '') {
            this.entity().updateTitleFromHeadline();
        }
        await super.save();
    }

    async confirmDelete() {
        if (confirm(DELETE_CONFIRM_MESSAGE)) {
            await this.delete();
        }
    }

    validation = {
        title: {
        },
        contents: {
        }
    };
}

ko.components.register('notes-form', {
    viewModel: NotesFormViewModel,
    template: template
});
