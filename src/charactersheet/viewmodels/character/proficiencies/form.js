import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';

import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Proficiency } from 'charactersheet/models';
import { SELECTDATA } from 'charactersheet/constants';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class ProficiencyFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    modelClass () {
        return Proficiency;
    }

    prePopSource = 'proficiencies';
    prePopLimit = SELECTDATA.MEDIUM;

    proficiencyType = Fixtures.proficiency.proficiencyTypes;
    setType = (label, value) => {
        this.entity().type(value);
    };
}

ko.components.register('proficiency-form', {
    viewModel: ProficiencyFormViewModel,
    template: template
});
