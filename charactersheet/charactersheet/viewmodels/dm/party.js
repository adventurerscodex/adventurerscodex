'use strict';


function PartyViewModel() {
    var self = this;

    self.players = [
        {
            image: 'http://www.gravatar.com/avatar/11b074a636e00292c98e3e60f7e16595?d=mm',
            name: 'Brom Erriksson',
            level: 2,
            armorClass: 13,
            playerName: 'Brian Schrader',
            summary: 'A level 4 orc warrior by Brian Schrader',
            hitpoints: 56,
            damage: 32,
            hitDice: '4 (D6)'
        },
        {
            image: 'http://www.gravatar.com/avatar/5af11548d191b476eb4d73e9d540579a?d=mm',
            name: 'Joe Thorinsn',
            level: 4,
            armorClass: 11,
            playerName: 'Brian Schrader',
            summary: 'A level 4 elf wizard by Brian Schrader',
            hitpoints: 56,
            damage: 32,
            hitDice: '4 (D6)'
        },

    ];

    self.load = function() {

    };

    self.unload = function() {

    };
}
