import { KOModel } from 'hypnos';
import ko from 'knockout';


export class CharacterClass extends KOModel {
    static __skeys__ = ['core', 'characterClasss'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    level = ko.observable('');
    url = ko.observable('');
}