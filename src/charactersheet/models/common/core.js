import ko from 'knockout';
import { KOModel } from 'hypnos';


export class Core extends KOModel {

    static __skeys__ = ['core'];

    static mapping = {
        include: [],
    };

    summary = ko.pureComputed(() => {
        return `${this.playerName()}: a ${this.type.description()}.`;
    });
}
