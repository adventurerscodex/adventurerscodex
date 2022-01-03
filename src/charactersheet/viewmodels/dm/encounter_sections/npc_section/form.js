import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { NPC } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class NPCFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return NPC;
    }
}


ko.components.register('npc-form', {
    viewModel: NPCFormViewModel,
    template: template
});
