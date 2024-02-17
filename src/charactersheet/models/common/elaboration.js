import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Elaboration extends KOModel {
    static __skeys__ = ['elaborate'];

    static mapping = {
        include: []
    };

    description = ko.observable();
}
