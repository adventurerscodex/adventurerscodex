import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class AbilityScore extends KOModel {
    constructor(params) {
        super(params);
    }
    static __skeys__ = ['core', 'abilityScores'];
    static __dependents__ = ['Skill', 'SavingThrow'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    value = ko.observable(1);
    shortName = ko.observable('');
    abbreviation = ko.observable('');

    getModifier() {
        if (this.value()) {
            return Math.floor((this.value() - 10) / 2);
        } else {
            return 0;
        }
    }

    save = async () => {
        const response = await this.ps.save();
        Notifications.abilityScores.changed.dispatch(this);
        return response;
    }
}

AbilityScore.validationConstraints = {
    rules: {
        value: {
            type: 'number',
            required: true,
            min: -10000,
            max: 1000000
        }
    }
};
