import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';

export class OtherStats extends KOModel {
    static __skeys__ = ['core', 'characters', 'otherStats'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    armorClassModifier = ko.observable(0);
    initiativeModifier = ko.observable(0);
    speed = ko.observable(0);
    inspiration = ko.observable(false);
    proficiencyModifier = ko.observable(0);

    toSchemaValues = (values) => ({
        ...values,
        armorClassModifier:  values.armorClassModifier  !== '' ? values.armorClassModifier  : 0,
        initiativeModifier:  values.initiativeModifier  !== '' ? values.initiativeModifier  : 0,
        speed:               values.speed               !== '' ? values.speed               : 0,
        proficiencyModifier: values.proficiencyModifier !== '' ? values.proficiencyModifier : 0
    })

    save = async () => {
        const response = await this.ps.save();
        Notifications.otherStats.changed.dispatch(this);
        return response;
    }
}

OtherStats.validationConstraints = {
    rules: {
        armorClassModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        },
        initiativeModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        },
        speed: {
            type: 'number',
            min: 0,
            max: 10000
        },
        proficiencyModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        }
    }
};
