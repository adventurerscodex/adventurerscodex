import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Elaboration extends KOModel {
    static __skeys__ = ['elaborate', 'campaigns', 'encounters'];

    static mapping = {
        include: []
    };

    description = ko.observable();
}
