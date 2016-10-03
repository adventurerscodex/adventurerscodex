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
        magicItemTypeOptions : [
            'Armor', 'Sword', 'Rod', 'Ring', 'Staff',
            'Wand', 'Potion', 'Wondrous Item'],
        magicItemRarityOptions : [
            'Uncommon', 'Common', 'Rare', 'Rarity Varies',
            'Very Rare', 'Legendary']
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
    weapon : {
        weaponProficiencyOptions : [
            'Simple', 'Martial', 'Improvised', 'Nonlethal', 'Exotic'],
        weaponHandednessOptions : [
            'Light', 'One-Handed', 'Two-Handed'],
        weaponTypeOptions : [
            'Melee', 'Ranged'],
        weaponSizeOptions : [
            'Small', 'Medium', 'Large'],
        weaponPropertyOptions : [
            'Ammunition', 'Finesse', 'Heavy', 'Light', 'Loading',
            'Range', 'Reach', 'Special', 'Thrown', 'Versatile'],
        weaponDamageTypeOptions : [
            'Bludgeoning', 'Piercing', 'Slashing']
    },
    resting : {
        shortRestMessage : 'Your daily features, and relevant spell slots have been restored.',
        longRestMessage : 'Your hit dice, spell slots, hit points, ' +
              'and daily features have been restored.'
    },
    // List all migrations that should be applied
    migration : {
        scripts : [
            migration_110_1_skills,
            migration_110_2_spells,
            migration_110_3_stats
        ]
    },
    wizardProfile: {
        classes : ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
              'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'],
        races : ['Dwarf', 'Elf', 'Halfling', 'Human', 'Dragonborn', 'Gnome',
              'Half-Elf', 'Half-Orc', 'Tiefling']
    }
};
