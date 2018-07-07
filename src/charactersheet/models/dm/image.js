import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import { KOModel } from 'hypnos/lib/models/ko';


export class Image extends KOModel {
    static __skeys__ = ['core', 'images'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable();
    sourceUrl = ko.observable();
    isExhibited = ko.observable();
}