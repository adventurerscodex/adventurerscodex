import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Feature extends KOModel {
    static __skeys__ = ['core', 'features'];

    static mapping = {
        include: ['coreUuid', 'tracked']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    level = ko.observable(1);
    characterClass = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(null);
}

Feature.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 128
        },
        level: {
            number: true,
            min: 1,
            required: true
        },
        characterClass: {
            maxlength: 64
        },
        max: {
            required: true,
            number: true,
            min: 0
        }
    }
};
