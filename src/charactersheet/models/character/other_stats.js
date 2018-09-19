import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';

export class OtherStats extends KOModel {
    static __skeys__ = ['core', 'characters', 'otherStats'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    armorClassModifier = ko.observable(0);
    initiativeModifier = ko.observable(0);
    speed = ko.observable(0);
    inspiration = ko.observable(false);
    proficiencyModifier = ko.observable(0);
}
