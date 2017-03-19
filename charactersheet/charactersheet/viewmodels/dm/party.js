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
            hitDice: '4/4 (D6)',
            statusLine: 'Brom is <span class="text-info">inspired</span>'
                + ', <span class="text-danger">encumbered</span>, and carrying.',
            experience: 1234,
            spellSaveDC: 12,
            passiveIntelligence: 12,
            passiveWisdom: 15,
            gold: '~345 GP',
            moreInfoOpen: ko.observable(false)
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
            hitDice: '1/4 (D6)',
            statusLine: 'Joe is <span class="text-info">inspired</span>'
                + ', <span class="text-danger">encumbered</span>, and carrying nothing.',
            experience: 1234,
            spellSaveDC: 12,
            passiveIntelligence: 12,
            passiveWisdom: 15,
            gold: '~345 GP',
            moreInfoOpen: ko.observable(false)
        },
        {
            image: 'https://avatars3.githubusercontent.com/u/7286387?v=3&s=460',
            name: 'Ferage Thorinsn',
            level: 4,
            armorClass: 11,
            playerName: 'Brian Schrader',
            summary: 'A level 4 elf wizard by Brian Schrader',
            hitpoints: 56,
            damage: 32,
            hitDice: '1/4 (D6)',
            statusLine: 'Joe is <span class="text-info">inspired</span>'
                + ', <span class="text-danger">encumbered</span>, and carrying nothing.',
            experience: 1234,
            spellSaveDC: 12,
            passiveIntelligence: 12,
            passiveWisdom: 15,
            gold: '~345 GP',
            moreInfoOpen: ko.observable(false)
        },
        {
            image: 'http://www.gravatar.com/avatar/kk?d=mm',
            name: 'Another guy',
            level: 4,
            armorClass: 11,
            playerName: 'Brian Schrader',
            summary: 'A level 4 elf wizard by Brian Schrader',
            hitpoints: 56,
            damage: 32,
            hitDice: '1/4 (D6)',
            statusLine: 'Joe is <span class="text-info">inspired</span>'
                + ', <span class="text-danger">encumbered</span>, and carrying nothing.',
            experience: 1234,
            spellSaveDC: 12,
            passiveIntelligence: 12,
            passiveWisdom: 15,
            gold: '~345 GP',
            moreInfoOpen: ko.observable(false)
        },
        {
            image: 'http://www.gravatar.com/avatar/5af1154kk8d191b476eb4d73e9d540579a?d=mm',
            name: 'Billy Maize',
            level: 4,
            armorClass: 11,
            playerName: 'Brian Schrader',
            summary: 'A level 4 elf wizard by Brian Schrader',
            hitpoints: 56,
            damage: 32,
            hitDice: '1/4 (D6)',
            statusLine: 'Joe is <span class="text-info">inspired</span>'
                + ', <span class="text-danger">encumbered</span>, and carrying nothing.',
            experience: 1234,
            spellSaveDC: 12,
            passiveIntelligence: 12,
            passiveWisdom: 15,
            gold: '~345 GP',
            moreInfoOpen: ko.observable(false)
        },

    ];

    self.load = function() {

    };

    self.unload = function() {

    };
}
