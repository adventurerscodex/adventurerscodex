import { KOModel } from 'hypnos';
import ko from 'knockout';

export class ImageMedia extends KOModel {

    static __skeys__ = ['media'];

    static mapping = {
        include: ['uuid']
    };

    file = ko.observable(null);
    createdAt = ko.observable(null);
}
