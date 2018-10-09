import { KOModel } from 'hypnos';
import ko from 'knockout';

export class Profile extends KOModel {
    static __skeys__ = ['core', 'characters', 'profile'];

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
//     self.summary = ko.pureComputed(function() {
//         var desc = ((self.race() && self.race() !== '') &&
//                         (self.typeClass() && self.typeClass() !== '') &&
//                         (self.level() && self.level() !== '')) ?
//                     'A level ' + self.level() + ' ' + self.race() + ' ' + self.typeClass() + ' by '
//                         + self.playerName() : false;
//         desc = desc || 'A unique character, handcrafted from the finest bits the '
//             + 'internet can provide.';
//         return desc;
//     });
}

Profile.validationConstraints = {
    rules: {
        characterName: {
            maxlength: 128
        },
        alignment: {
            maxlength: 32
        },
        deity: {
            maxlength: 32
        },
        gender: {
            maxlength: 32
        },
        age: {
            number: true,
            min: 0
        },
        level: {
            number: true,
            min: 0
        },
        experience: {
            number: true,
            min: 0
        },
        weight: {
            number: true,
            min: 0
        },
        height: {
            maxlength: 32
        },
        hairColor: {
            maxlength: 32
        },
        eyeColor: {
            maxlength: 32
        },
        skinColor: {
            maxlength: 32
        },
        characterClass: {
            maxlength: 32
        }
    }
};
