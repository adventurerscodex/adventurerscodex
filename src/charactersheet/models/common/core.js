import ko from 'knockout';
import { KOModel } from 'charactersheet/services/common/ppersistence_service/model';


export class Core extends KOModel {

    static __skeys__ = ['core'];

    static mapping = {
        include: [],
    };

    summary = ko.pureComputed(() => {
        return `${this.playerName()}: a ${this.type.description()}.`;
    });
}

export class Item extends KOModel {

    static __skeys__ = ['core', 'items'];

    static mapping = {
        include: [],
    };
}
