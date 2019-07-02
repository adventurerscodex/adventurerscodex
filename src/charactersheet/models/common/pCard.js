import { Model } from 'hypnos';
import ko from 'knockout';


export class pCard extends Model {
    static __skeys__ = ['core', 'pcard'];

    static mapping = {
        include: []
    };

    get = (property) => {
        return [this[property]];
    }
}
