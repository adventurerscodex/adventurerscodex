import autoBind from 'auto-bind';

import { first, get, split, trim } from 'lodash';
import { DataRepository } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Companion } from 'charactersheet/models/character';
import { SELECTDATA } from 'charactersheet/constants';
import ko from 'knockout';
import template from './form.html';

class CompanionFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'monsters';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Companion;
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

    populate = (label, value) => {
        const item = DataRepository[this.prePopSource][label];
        let maxHitPoints;
        try {
            const hitPoints = get(item, 'hitPoints', '');
            const splitPoints = split(hitPoints, '(');
            const splitFirst = first(splitPoints);
            maxHitPoints = trim(splitFirst);
        } catch (error) {
            maxHitPoints = 10;
        }
        item['maxHitPoints'] = maxHitPoints;
        item['damage'] = 0;
        this.entity().importValues(item);
        this.showDisclaimer(true);
        this.forceCardResize();
    };
}


ko.components.register('companion-form', {
    viewModel: CompanionFormViewModel,
    template: template
});
