import autoBind from 'auto-bind';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { NPC } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';


class NPCFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.showElaboration = ko.observable(false);
    }

    modelClass() {
        return NPC;
    }

    elaborationContext = ko.pureComputed(() => (
        this.entity().name()
        ? `${this.entity().race() || 'Human'} named ${this.entity().name()}`
        : ''
    ));

    useElaboration(elaboration) {
        this.entity().description(elaboration.description());
        this.toggleElaboration();
    }

    toggleElaboration() {
        this.showElaboration(!this.showElaboration());
    }
}


ko.components.register('npc-form', {
    viewModel: NPCFormViewModel,
    template: template
});
