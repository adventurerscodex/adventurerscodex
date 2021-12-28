import autoBind from 'auto-bind';
import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import { Monster } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './form.html';
import { SELECTDATA } from 'charactersheet/constants';


class MonsterFormViewModel extends AbstractChildEncounterFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'monsters';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Monster;
    }

    generateBlank() {
        const blank = super.generateBlank();
        blank.abilityScores([
            { name: 'Strength', shortName: 'STR', value: 0},
            { name: 'Dexterity', shortName: 'DEX', value: 0},
            { name: 'Constitution', shortName: 'CON', value: 0},
            { name: 'Intelligence', shortName: 'INT', value: 0},
            { name: 'Wisdom', shortName: 'WIS', value: 0},
            { name: 'Charisma', shortName: 'CHA', value: 0}
        ]);
        return blank;
    }
}


ko.components.register('monster-form', {
    viewModel: MonsterFormViewModel,
    template: template
});
