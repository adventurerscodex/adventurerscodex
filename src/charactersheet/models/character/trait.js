import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Trait extends KOModel {
    static __skeys__ = ['core', 'traits'];

    static mapping = {
        include: ['coreUuid', 'tracked']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    race = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(null);
}

Trait.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        race: {
            maxlength: 64
        },
        max: {
            required: true
        }
    }
};
