import autoBind from 'auto-bind';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { PlayerText } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';


class ReadAloudTextFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
        this.showElaboration = ko.observable(false);
    }

    modelClass() {
        return PlayerText;
    }

    useElaboration(elaboration) {
        this.entity().description(elaboration.description());
        this.toggleElaboration();
    }

    toggleElaboration() {
        this.showElaboration(!this.showElaboration());
    }
}


ko.components.register('read-aloud-text-form', {
    viewModel: ReadAloudTextFormViewModel,
    template: template
});
