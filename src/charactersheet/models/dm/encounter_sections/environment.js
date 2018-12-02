import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class Environment extends KOModel {
    static __skeys__ = ['core', 'encounters', 'environment'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'sourceUrl', 'weather',
            'terrain', 'description', 'isExhibited']
    };

    coreUuid = ko.observable();
    uuid = ko.observable();
    imageUrl = ko.observable('');
    weather = ko.observable('');
    terrain = ko.observable('');
    description = ko.observable('');
    isExhibited = ko.observable(false);

    //Public Methods

    toJSON = function() {
        return { name: 'Environment', url: this.sourceUrl() };
    };

    name = ko.pureComputed(() => {
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

Environment.validationConstraints = {
    rules: {
        weather: {
            maxlength: 128
        },
        terrain: {
            maxlength: 128
        },
        imageUrl: {
            maxlength: 512,
            url: true
        }
    }
};
