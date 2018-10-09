import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Proficiency extends KOModel {
    static __skeys__ = ['core', 'proficiencys'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    description = ko.observable('');
}

Proficiency.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 128
        },
        type: {
            maxlength: 64
        }
    }
};