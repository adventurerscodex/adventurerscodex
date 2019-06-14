import {
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

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
    generateBlank() {
        return new Note();
    }

    save = async () => {
        if (!this.entity().title() || this.entity().title().trim() === '') {
            this.entity().updateTitleFromHeadline();
        }
        await super.save();
    }
    notify() {
        // Notifications.notes.changed.add(self.reloadData);
    }

    validation = {
        title: {},
        contents: {}
        // Deep copy of properties in object
        //...Note.validationConstraints.rules
    };
}

ko.components.register('notes-form', {
    viewModel: NotesFormViewModel,
    template: template
});
