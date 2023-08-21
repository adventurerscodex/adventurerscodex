import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Elaboration extends KOModel {
    static __skeys__ = ['elaborate'];

    static mapping = {
        include: []
    };

    name = ko.observable();
    description = ko.observable();
    quirk = ko.observable();
}
