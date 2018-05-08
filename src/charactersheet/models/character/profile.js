import { KOModel } from 'hypnos';
import ko from 'knockout';

export class Profile extends KOModel {
    static __skeys__ = ['core', 'characters', 'profile'];

    static mapping = {
        ignore: ['url']
    };

    coreUuid = ko.observable(null);
    characterName = ko.observable('');
    background = ko.observable('');
    alignment = ko.observable('');
    diety = ko.observable('');
    gender = ko.observable('');
    age = ko.observable('');
    experience = ko.observable('');
    weight = ko.observable('');
    height = ko.observable('');
    hairColor = ko.observable('');
    eyeColor = ko.observable('');
    skinColor = ko.observable('');
    level = ko.observable('');
    characterClass = ko.observable('');
    race = ko.observable('');

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
