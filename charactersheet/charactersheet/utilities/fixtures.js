Fixtures = {
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
            'Attack Roll', 'Savings Throw', 'Automatic'],
        spellSaveAttrOptions : [
            'Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'],
        spellSchoolOptions : [
            'Abjuration', 'Cantrip', 'Conjuration',
            'Divination', 'Enchantment', 'Evocation',
            'Illusion', 'Necromancy', 'Transmutation'],
        spellCastingTimeOptions : [
            '1 action', '1 bonus action', '1 reaction', '1 minute',
            '10 minutes', '1 hour'],
        spellDurationOptions : [
            'Instantaneous', '1 round', '1 min', '10 min', '1 hour', '8 hours',
            '24 hours', '10 days', 'Concentration, 1 min',
            'Concentration, 10 min', 'Concentration, 1 hour', 'Concentration, 8 hours',
            'Concentration, 24 hours', 'Special',
            'Until dispelled'],
        spellComponentsOptions : [
            'S', 'V', 'V, S', 'S, M', 'V, M', 'V, S, M'],
        spellRangeOptions : [
            'Self', 'Touch', '5 ft', '10 ft', '30 ft', '60 ft',
            '90 ft', '100 ft', '120 ft', '150 ft', '300 ft', '500 ft', '1 mile','Special']
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
            migration_110_1_skills
        ]
    },
    wizardProfile: {
        classes : ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
            'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'],
        races : ['Dwarf', 'Elf', 'Halfling', 'Human', 'Dragonborn', 'Gnome',
            'Half-Elf', 'Half-Orc', 'Tiefling']
    }
};
