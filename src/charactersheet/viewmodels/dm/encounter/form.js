import { Notifications } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Encounter, EncounterSection } from 'charactersheet/models/dm';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class EncounterFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.parent = params.parent;
    }

    async load() {
        const { objects } = await EncounterSection.ps.list();
        this.sectionTypes = objects;

        await super.load();
    }

    modelClass() {
        return Encounter;
    }

    generateBlank() {
        const blank = super.generateBlank();
        blank.sections(this.sectionTypes.map(section => (
            ko.mapping.fromJS(section.toSectionValues())
        )));
        if (!!this.parent) {
            blank.parent(this.parent.uuid());
        }
        return blank;
    }
}


ko.components.register('encounter-form', {
    viewModel: EncounterFormViewModel,
    template: template
});
