import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Utility } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class Image extends KOModel {
    static __skeys__ = ['core', 'images'];

    static mapping = {
        include: ['coreUuid', 'description']
    };

    coreUuid = ko.observable(null);
    name = ko.observable();
    description = ko.observable();
    sourceUrl = ko.observable();
    isExhibited = ko.observable();

    shortDescription = ko.pureComputed(() => {
        try {
            return Utility.string.truncateStringAtLength(this.description(), 100);
        } catch(e) {}
    });
}