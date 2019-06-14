import { KOModel } from 'hypnos';
import ko from 'knockout';

export class ShareKey extends KOModel {
    static __skeys__ = ['core', 'shareKeys'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    link = ko.observable(null);
    createdAt = ko.observable(null);

    createdAtDisplay = ko.pureComputed(() => {
        var date = new Date(this.createdAt());
        return date.toLocaleDateString();
    });
}
