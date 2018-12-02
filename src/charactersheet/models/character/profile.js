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
