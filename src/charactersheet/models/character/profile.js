import { KOModel } from 'hypnos';
import ko from 'knockout';

export class Profile extends KOModel {
    static __skeys__ = ['core', 'characters', 'profile'];

    static mapping = {
        ignore: ['url'],
    };

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
