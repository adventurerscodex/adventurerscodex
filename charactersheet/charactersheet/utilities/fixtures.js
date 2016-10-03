'use strict';

var Fixtures = {
    general : {
        currencyDenominationList : [
            'PP', 'GP', 'SP', 'EP', 'CP'],
        colorList: [
            'progress-bar-forest',
            'progress-bar-sky',
            'progress-bar-orange',
            'progress-bar-red',
            'progress-bar-purple',
            'progress-bar-teal',
            'progress-bar-indigo',
            'progress-bar-brown',
            'progress-bar-yellow',
            'progress-bar-magenta',
            'progress-bar-green',
            'progress-bar-blue',
            'progress-bar-red',
            'progress-bar-purple',
            'progress-bar-teal',
            'progress-bar-blue',
            'progress-bar-indigo'
        ]
    },
    carryCapacity: {
        '1': { light: 3, medium: 6, heavy: 10 },
        '2': { light: 6, medium: 13, heavy: 20 },
        '3': { light: 10, medium: 20, heavy: 30 },
        '4': { light: 13, medium: 26, heavy: 40 },
        '5': { light: 16, medium: 33, heavy: 50 },
        '6': { light: 20, medium: 40, heavy: 60 },
        '7': { light: 23, medium: 46, heavy: 70 },
        '8': { light: 26, medium: 53, heavy: 80 },
        '9': { light: 30, medium: 60, heavy: 90 },
        '10': { light: 33, medium: 66, heavy: 100 },
        '11': { light: 38, medium: 76, heavy: 115 },
        '12': { light: 43, medium: 86, heavy: 130 },
        '13': { light: 50, medium: 100, heavy: 150 },
        '14': { light: 58, medium: 116, heavy: 175 },
        '15': { light: 66, medium: 133, heavy: 200 },
        '16': { light: 76, medium: 153, heavy: 230 },
        '17': { light: 86, medium: 173, heavy: 260 },
        '18': { light: 100, medium: 200, heavy: 300 },
        '19': { light: 116, medium: 233, heavy: 350 },
        '20': { light: 133, medium: 266, heavy: 400 },
        '21': { light: 153, medium: 306, heavy: 460 },
        '22': { light: 173, medium: 346, heavy: 520 },
        '23': { light: 200, medium: 400, heavy: 600 },
        '24': { light: 233, medium: 466, heavy: 700 },
        '25': { light: 266, medium: 533, heavy: 800 },
        '26': { light: 306, medium: 613, heavy: 920 },
        '27': { light: 346, medium: 693, heavy: 1040 },
        '28': { light: 400, medium: 800, heavy: 1200 },
        '29': { light: 466, medium: 933, heavy: 1400 }
    },
    armor : {
        armorTypeOptions : [
            'Light', 'Medium', 'Heavy', 'Shields'],
        armorStealthOptions : [
            'Advantage', 'Normal', 'Disadvantage']
    },
    hitDiceType : {
        hitDiceOptions : [
            'D4', 'D6', 'D8', 'D10', 'D12', 'D20']
    },
    magicItem : {
        magicItemTypeOptions: [
            'Armor',
            'Armor (chain shirt)',
            'Armor (light or medium or heavy)',
            'Armor (medium or heavy but not hide)',
            'Armor (plate)',
            'Armor (scale mail)',
            'Armor (shield)',
            'Armor (studded leather)',
            'Potion',
            'Ring',
            'Rod',
            'Scroll',
            'Staff',
            'Sword',
            'Wand',
            'Weapon (any axe or sword)',
            'Weapon (any axe)',
            'Weapon (any sword that deals slashing damage)',
            'Weapon (any sword)',
            'Weapon (any)',
            'Weapon (arrow)',
            'Weapon (dagger)',
            'Weapon (javelin)',
            'Weapon (longbow)',
            'Weapon (longsword)',
            'Weapon (mace)',
            'Weapon (maul)',
            'Weapon (scimitar)',
            'Weapon (trident)',
            'Weapon (warhammer)',
            'Wondrous item'
        ],
        magicItemRarityOptions: [
            'Common',
            'Legendary',
            'Rare',
            'Rarity By Figurine',
            'Rarity Varies',
            'Uncommon',
            'Varies',
            'Very Rare',
            'Very Rare Or Legendary'
        ]
    },
    spell : {
        spellTypeOptions : [
            'Ability Check',
            'Attack Roll',
            'Automatic',
            'Contest',
            'Melee Spell Attack',
            'Ranged Spell Attack',
            'Savings Throw'],
        spellSaveAttrOptions : [
            'Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'],
        spellSchoolOptions : [
            'Abjuration',
            'Conjuration',
            'Divination',
            'Enchantment',
            'Evocation',
            'Illusion',
            'Necromancy',
            'Transmutation'],
        spellCastingTimeOptions : [
            '1 action',
            '1 action or 8 hours',
            '1 bonus action',
            '1 hour',
            '1 minute',
            '1 reaction',
            '10 minutes',
            '12 hours',
            '24 hours',
            '8 hours'],
        spellDurationOptions : [
            '1 day',
            '1 hour',
            '1 minute',
            '1 round',
            '10 days',
            '10 minutes',
            '24 hours',
            '30 days',
            '7 days',
            '8 hours',
            'Concentration, up to 1 day',
            'Concentration, up to 1 hour',
            'Concentration, up to 1 minute',
            'Concentration, up to 1 round',
            'Concentration, up to 10 minutes',
            'Concentration, up to 2 hours',
            'Concentration, up to 24 hours',
            'Concentration, up to 8 hours',
            'Concentration, up to one minute',
            'Instantaneous',
            'Special',
            'Until dispelled',
            'Until dispelled or triggered',
            'Up to 1 hour',
            'Up to 1 minute',
            'Up to 8 hours'],
        spellComponentsOptions : [
            'S',
            'S, M',
            'V',
            'V, M',
            'V, S',
            'V, S, M'],
        spellRangeOptions : [
            '1 mile',
            '10 feet',
            '100 feet',
            '120 feet',
            '150 feet',
            '30 feet',
            '300 feet',
            '5 feet',
            '500 feet',
            '500 miles',
            '60 feet',
            '90 feet',
            'Self',
            'Self (10-foot radius)',
            'Self (10-foot-radius hemisphere)',
            'Self (10-foot-radius sphere)',
            'Self (100-foot line)',
            'Self (15-foot cone)',
            'Self (15-foot cube)',
            'Self (15-foot radius)',
            'Self (30-foot cone)',
            'Self (30-foot radius)',
            'Self (5-mile radius)',
            'Self (60-foot cone)',
            'Self (60-foot line)',
            'Sight',
            'Special',
            'Touch',
            'Unlimited']
    },
    spellStats : {
        spellcastingAbilityOptions: [
            'INT', 'WIS', 'CHA']
    },
    profile: {
        alignmentOptions: [
            'Lawful good',
            'Neutral good',
            'Chaotic good',
            'Lawful neutral',
            'Neutral',
            'Chaotic neutral',
            'Lawful evil',
            'Neutral evil',
            'Chaotic evil'
        ],

        backgroundOptions: [
            'Acolyte',
            'Charlatan',
            'Criminal',
            'Entertainer',
            'Folk Hero',
            'Guild Artisan',
            'Hermit',
            'Noble',
            'Outlander',
            'Sage',
            'Sailor',
            'Soldier',
            'Urchin'
        ],

        classOptions: [
            'Barbarian',
            'Bard',
            'Cleric',
            'Druid',
            'Fighter',
            'Monk',
            'Paladin',
            'Ranger',
            'Rogue',
            'Sorcerer',
            'Warlock',
            'Wizard'
        ],

        raceOptions: [
            'Dwarf',
            'Elf',
            'Halfling',
            'Human',
            'Dragonborn',
            'Gnome',
            'Half-Elf',
            'Half-Orc',
            'Tiefling'
        ]
    },
    weapon: {
        weaponDamageTypeOptions: [
            '',
            'Bludgeoning',
            'Piercing',
            'Slashing'
        ],
        weaponHandednessOptions: [
            'One or Two Handed',
            'One-Handed',
            'Two-Handed'
        ],
        weaponProficiencyOptions: [
            'Martial',
            'Simple'
        ],
        weaponPropertyOptions: [
            '',
            'Ammunition',
            'Ammunition and Heavy',
            'Ammunition and Loading',
            'Ammunition, Loading and Heavy',
            'Finesse',
            'Finesse and Reach',
            'Finesse and Thrown',
            'Finesse, Light and Thrown',
            'Heavy',
            'Heavy and Reach',
            'Light',
            'Light and Finesse',
            'Light and Thrown',
            'Light, Ammunition, and Loading',
            'Ranged, Ammunition, and Loading',
            'Reach and Special',
            'Special and Thrown',
            'Thrown',
            'Thrown and Versatile',
            'Versatile'
        ],
        weaponTypeOptions: [
            'Melee',
            'Ranged'
        ]
    },
    resting : {
        shortRestMessage : 'Your daily features, and relevant spell slots have been restored.',
        longRestMessage : 'Your hit dice, spell slots, hit points, ' +
              'and daily features have been restored.'
    }
};
