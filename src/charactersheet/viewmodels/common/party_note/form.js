import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Note } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class NotesFormViewModel  extends AbstractChildFormModel {
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
