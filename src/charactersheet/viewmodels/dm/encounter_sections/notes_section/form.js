import autoBind from 'auto-bind';
import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbstractEncounterFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterNote } from 'charactersheet/models/dm/encounter_sections';
import ko from 'knockout';
import template from './form.html';


class NotesSectionFormViewModel extends AbstractEncounterFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.entity = params.entity;
    }

    modelClass() {
        return EncounterNote;
    }

    // UI

    name = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.notes.index;
        return this.encounter().sections()[index].name();
    });

    tagline = ko.pureComputed(() => {
        const index = Fixtures.encounter.sections.notes.index;
        return this.encounter().sections()[index].tagline();
    });
}


ko.components.register('encounter-notes-form', {
    viewModel: NotesSectionFormViewModel,
    template: template
});
