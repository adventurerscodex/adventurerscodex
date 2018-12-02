import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Background extends KOModel {
    static __skeys__ = ['core', 'characters', 'background'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    ideal = ko.observable('');
    flaw = ko.observable('');
    bond = ko.observable('');
    personalityTrait = ko.observable('');
}

Background.validationConstraints = {
    rules: {
        name: {
            maxlength: 256
        }
    }
};
