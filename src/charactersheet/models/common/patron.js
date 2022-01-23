import { KOModel } from 'hypnos';
import { observable } from 'knockout';


export class Patron extends KOModel {

    static __skeys__ = ['patrons', 'random'];

    static mapping = {
        include: ['name'],
    };

    name = observable(null);
}
