import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { NotesFormViewModel } from './form';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class NotesListModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-note';
        this.collapseAllId = '#notes-pane';
        autoBind(this);
    }
    modelName = 'Note';

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
}

ko.components.register('notes-list', {
    viewModel: NotesListModel,
    template: template
});
