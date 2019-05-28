import {
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormController } from 'charactersheet/components/form-controller-component';
import { Note } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class NotesFormViewModel  extends FormController {
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
        Notifications.notes.changed.add(self.reloadData);
    }

    validation = {
        // Deep copy of properties in object
        ...Note.validationConstraints
    };
}

ko.components.register('notes-form', {
    viewModel: NotesFormViewModel,
    template: template
});
