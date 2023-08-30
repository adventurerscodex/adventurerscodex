import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { NPC } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';
import { generate_name } from 'charactersheet/services/common';


class NPCFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return NPC;
    }

    generateRandomName() {
        const firstName = generate_name('firstName');
        const lastName = generate_name('lastName');
        this.entity().name(`${firstName} ${lastName}`);
    }
}


ko.components.register('npc-form', {
    viewModel: NPCFormViewModel,
    template: template
});
