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

    modifier = ko.pureComputed(() => {
        if (this.value()) {
            return Math.floor((this.value() - 10) / 2);
        } else {
            return 0;
        }
    })

    getModifier() {
        if (this.value()) {
            return Math.floor((this.value() - 10) / 2);
        } else {
            return 0;
        }
    }

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.abilityscore.changed.dispatch(this);
    }
}

AbilityScore.validationConstraints = {
    fieldParams: {
        value: {
            type: 'number',
            pattern: '\\d*',
            required: true,
            min: -10000,
            max: 1000000
        }
    }
};
