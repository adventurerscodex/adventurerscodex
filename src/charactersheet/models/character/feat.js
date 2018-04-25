import { KOModel } from 'hypnos';
import ko from 'knockout';

export class Feat extends KOModel {
    static __skeys__ = ['core', 'feats'];

    static mapping = {
        include: ['coreUuid', 'tracked']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(null);
}