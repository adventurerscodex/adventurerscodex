import { CoreManager } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';

export class Profile extends KOModel {
    static __skeys__ = ['core', 'characters', 'profile'];
    static __dependents__ = ['Core'];

    static mapping = {
        ignore: ['url']
    };

    coreUuid = ko.observable(null);
    characterName = ko.observable('');
    alignment = ko.observable('');
    deity = ko.observable('');
    gender = ko.observable('');
    age = ko.observable();
    experience = ko.observable();
    weight = ko.observable();
    height = ko.observable('');
    hairColor = ko.observable('');
    eyeColor = ko.observable('');
    skinColor = ko.observable('');
    level = ko.observable();
    characterClass = ko.observable('');
    race = ko.observable('');

    toSchemaValues = (values) => {
        if (values.age === '') {
            values.age = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        if (values.level === '') {
            values.level = 0;
        }

        if (values.experience === '') {
            values.experience = 0;
        }

        return values;
    }

    summary = ko.pureComputed(() => {
        const core = CoreManager.activeCore();
        let desc = ((this.race() && this.race() !== '') &&
                        (this.characterClass() && this.characterClass() !== '') &&
                        (this.level() && this.level() !== '')) ?
                    'A level ' + this.level() + ' ' + this.race() + ' ' + this.characterClass() + ' by '
                        + core.playerName() : false;
        desc = desc || 'A unique character, handcrafted from the finest bits the '
            + 'internet can provide.';
        return desc;
    });

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.profile.changed.dispatch(this);
    }
}

Profile.validationConstraints = {
    rules: {
        characterName: {
            maxlength: 256
        },
        alignment: {
            maxlength: 64
        },
        deity: {
            maxlength: 64
        },
        gender: {
            maxlength: 64
        },
        age: {
            type: 'number',
            min: 0,
            max: 1000000
        },
        level: {
            type: 'number',
            min: 0,
            max: 10000
        },
        experience: {
            type: 'number',
            min: -1000000,
            max: 100000000
        },
        weight: {
            type: 'number',
            min: 0,
            max: 10000
        },
        height: {
            maxlength: 64
        },
        hairColor: {
            maxlength: 64
        },
        eyeColor: {
            maxlength: 64
        },
        skinColor: {
            maxlength: 64
        },
        characterClass: {
            maxlength: 64
        }
    }
};
