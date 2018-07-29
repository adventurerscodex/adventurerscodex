import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class Environment extends KOModel {
    static __skeys__ = ['core', 'environment'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'imageUrl', 'weather',
            'terrain', 'description', 'isExhibited']
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();
    imageUrl = ko.observable();
    weather = ko.observable();
    terrain = ko.observable();
    description = ko.observable();
    isExhibited = ko.observable(false);

    //Public Methods

    toJSON = function() {
        return { name: 'Environment', url: this.imageUrl() };
    };

    name = ko.pureComputed(function() {
        return 'Weather: {weather}, Terrain: {terrain}'.replace(
            '{weather}', this.weather() ? this.weather() : 'Unknown'
        ).replace(
            '{terrain}', this.terrain() ? this.terrain() : 'Unknown'

        );
    });

    toHTML = function() {
        return 'New environment';
    };
}