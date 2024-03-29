import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class Environment extends KOModel {

    static __skeys__ = ['core', 'encounters', 'environment'];

    static __dependents__ = [
        'Image',
        'NPC',
        'PlayerText',
        'PointOfInterest',
        'Monster',
        'EncounterImage',
    ];

    static mapping = {
        include: [
            'coreUuid',
            'encounterUuid',
            'imageUrl',
            'weather',
            'terrain',
            'description',
            'isExhibited',
        ]
    };

    coreUuid = ko.observable();
    uuid = ko.observable();
    imageUrl = ko.observable('');
    weather = ko.observable('');
    terrain = ko.observable('');
    description = ko.observable('');
    isExhibited = ko.observable(false);

    // Public Methods

    name = ko.pureComputed(() => {
        return 'Weather: {weather}, Terrain: {terrain}'.replace(
            '{weather}', this.weather() ? this.weather() : 'Unknown'
        ).replace(
            '{terrain}', this.terrain() ? this.terrain() : 'Unknown'

        );
    });

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
    }

    delete = async () => {
        await this.ps.delete();
    }
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
            maxlength: 1024,
            url: true
        }
    }
};
