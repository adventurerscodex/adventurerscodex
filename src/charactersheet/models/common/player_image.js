import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class ProfileImage extends KOModel {
    static __skeys__ = ['core', 'characters', 'profileImage'];
    static __dependents__ = ['Core'];

    static mapping = {
        include: ['coreUuid']
    };

    sourceUrl = ko.observable();
    email = ko.observable();
    type = ko.observable();
}
