export var Fixtures = {
    defaultProfilePictures: [
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/elf-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/elf-head-2.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/emo-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/sorceress-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/warrior-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/warlock-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/orc-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/druid-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/druid-head-2.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/dude-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/dwarf-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/knight-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/mechanic-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/merchant-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/ranger-head.png'
        },
        {
            name: '',
            image: 'https://app.adventurerscodex.com/images/sample-headshots/troll-head.png'
        }
    ],
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
        ],
        colorHexList: [
            '#2F972F',
            '#71D4E8',
            '#f0ad4e',
            '#d9534f',
            '#800080',
            '#01DFD7',
            '#8000FF',
            '#906713',
            '#D7DF01',
            '#C82D78',
            '#5cb85c',
            '#337ab7'
        ],
        healthColor: {
            dangerous: '#E74C3C',
            warning: '#F39C12',
            healthy: '#18bC9C',
            tempHP: '#71D4E8',
            tempHPBackground: '#FFF'
        }
    },
    armor : {
        constants: {
            types: {
                shield: 'Shield',
                light: 'Light',
                medium: 'Medium',
                heavy: 'Heavy'
            }
        },
        armorTypeOptions : [
            'Light', 'Medium', 'Heavy', 'Shield'],
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
        typeOptions : [
            'Ability Check',
            'Attack Roll',
            'Automatic',
            'Contest',
            'Melee Spell Attack',
            'Ranged Spell Attack',
            'Savings Throw'],
        spellSaveAttrOptions : [
            'Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'],
        schoolOptions : [
            'Abjuration',
            'Conjuration',
            'Divination',
            'Enchantment',
            'Evocation',
            'Illusion',
            'Necromancy',
            'Transmutation'],
        castingTimeOptions : [
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
        durationOptions : [
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
        componentsOptions : [
            'S',
            'S, M',
            'V',
            'V, M',
            'V, S',
            'V, S, M'],
        rangeOptions : [
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
            'Unlimited'],
        damageTypeOptions: [
            'Acid',
            'Bludgeoning',
            'Cold',
            'Fire',
            'Force',
            'Lightning',
            'Necrotic',
            'Piercing',
            'Poison',
            'Psychic',
            'Radiant',
            'Slashing',
            'Thunder'
        ]
    },
    spellStats : {
        spellcastingAbilityOptions: [
            'INT', 'WIS', 'CHA']
    },
    proficiency: {
        proficiencyTypes: [
            'Armor',
            'Languages',
            'Tools',
            'Weapon'
        ]
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
            'Hill Dwarf',
            'High Elf',
            'Elf',
            'Lightfoot Halfling',
            'Halfling',
            'Human',
            'Dragonborn',
            'Rock Gnome',
            'Gnome',
            'Half-Elf',
            'Half-Orc',
            'Tiefling'
        ]
    },
    weapon: {
        weaponDamageTypeOptions: [
            'Acid',
            'Bludgeoning',
            'Cold',
            'Fire',
            'Force',
            'Lightning',
            'Necrotic',
            'Piercing',
            'Poison',
            'Psychic',
            'Radiant',
            'Slashing',
            'Thunder'
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
        shortRestMessage : 'Your relevant Spell Slots, Tracked Features, ' +
              'Feats, and Traits have been restored.',
        longRestMessage : 'Your Hit Dice, Spell Slots, Hit Points, ' +
              'Tracked Features, Feats, and Traits have been restored.',
        dawnMessage: 'Your relevant Spell Slots, Tracked Features, ' +
              'Feats, and Traits have been restored.',
        shortRestEnum : 'short',
        longRestEnum : 'long',
        dawnEnum : 'dawn',
    },
    wizardProfile: {
        classes : ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
            'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'],
        races : [
            'Dwarf',
            'Hill Dwarf',
            'High Elf',
            'Elf',
            'Lightfoot Halfling',
            'Halfling',
            'Human',
            'Dragonborn',
            'Rock Gnome',
            'Gnome',
            'Half-Elf',
            'Half-Orc',
            'Tiefling'
        ],

        backpackOptions : [
            '---',
            'Burglar\'s Pack',
            'Diplomat\'s Pack',
            'Dungeoneer\'s Pack',
            'Entertainer\'s Pack',
            'Explorer\'s Pack',
            'Priest\'s Pack',
            'Scholar\'s  Pack'
        ],

        motifOptions: [
            'Fantasy/Adventure',
            'Noir/Mystery',
            'Magic Punk',
            'Modern/Urban',
        ],

        settingOptions: [
            'Forgotten Realms',
            'Eberron',
            'Homebrew',
            'Other',
        ]
    },
    statusPhraseWordMap: {
        health: [{
            'value': 1.0,
            'status': 'healthy',
            'color': 'success'
        },{
            'value': 0.85,
            'status': 'mostly healthy',
            'color': 'success'
        },{
            'value': 0.60,
            'status': 'injured',
            'color': 'warning'
        },{
            'value': 0.30,
            'status': 'gravely injured',
            'color': 'warning'
        },{
            'value': 0.15,
            'status': 'critically injured',
            'color': 'warning'
        },{
            'value': 0.05,
            'status': 'about to die',
            'color': 'danger'
        },{
            'value': 0.0,
            'status': 'unconscious',
            'color': 'danger'
        },{
            'value': -1,
            'status': 'unconscious and stable',
            'color': 'danger'
        },{
            'value': -2,
            'status': 'dead',
            'color': 'danger'
        }],
        magic: [{
            'value': 1.0,
            'status': 'magically prepared',
            'color': 'success'
        },{
            'value': 0.60,
            'status': 'magically strained',
            'color': 'warning'
        },{
            'value': 0.25,
            'status': 'magically exhausted',
            'color': 'warning'
        },{
            'value': 0.0,
            'status': 'magically depleted',
            'color': 'danger'
        }],
        tracked: [{
            'value': 1.0,
            'status': 'bursting with abilities',
            'color': 'success'
        },{
            'value': 0.75,
            'status': 'good on abilities',
            'color': 'success'
        },{
            'value': 0.50,
            'status': 'low on abilities',
            'color': 'warning'
        },{
            'value': 0.25,
            'status': 'about to run out of abilities',
            'color': 'warning'
        },{
            'value': 0.0,
            'status': 'out of abilities',
            'color': 'danger'
        }]
    },
    abilityScores: {
        constants: {
            strength: {
                name: 'Strength',
                shortName: 'STR'
            },
            dexterity: {
                name: 'Dexterity',
                shortName: 'DEX'
            },
            constitution: {
                name: 'Constitution',
                shortName: 'CON'
            },
            intelligence: {
                name: 'Intelligence',
                shortName: 'INT'
            },
            wisdom: {
                name: 'Wisdom',
                shortName: 'WIS'
            },
            charisma: {
                name: 'Charisma',
                shortName: 'CHA'
            }
        }
    },
    chatRoom: {
        type: {
            party: 'party',
            chat: 'chat'
        }
    },
    encounter: {
        sections: {
            environment: {
                name: 'Environment',
                index: 0
            },
            traps: {
                name: 'Traps',
                index: 1
            },
            mapsAndImages: {
                name: 'Maps and Images',
                index: 2
            },
            pointsOfInterest: {
                name: 'Points of Interest',
                index: 3
            },
            npcs: {
                name: 'Non-Player Characters',
                index: 4
            },
            monsters: {
                name: 'Monsters',
                index: 5
            },
            readAloudText: {
                name: 'Read-Aloud Text',
                index: 6
            },
            treasure: {
                name: 'Treasure',
                index: 7
            },
            notes: {
                name: 'Notes',
                index: 8
            }
        }
    },
    difficultyCheckOptions: [
        'Acrobatics',
        'Animal Handling',
        'Arcana',
        'Athletics',
        'Charisma',
        'Constitution',
        'Deception',
        'Dexterity',
        'History',
        'Insight',
        'Intelligence',
        'Intimidation',
        'Investigation',
        'Medicine',
        'Nature',
        'Perception',
        'Performance',
        'Persuasion',
        'Religion',
        'Sleight of Hand',
        'Stealth',
        'Strength',
        'Survival',
        'Wisdom',
    ],
    import: {
        masterTable: [
            'Character','Profile','PlayerInfo','Skill','CharacterAppearance','FeaturesTraits','ImageModel','Health','OtherStats','DeathSave','HitDiceType','AbilityScores','SavingThrows','SpellStats','FeatsProf','Treasure','Note','HitDice','Slot','Item','Spell','Armor','Weapon','MagicItem','Status','PlayerImage','Campaign','DailyFeature','Encounter','EnvironmentSection','PointOfInterestSection','NPCSection','MonsterSection','PlayerTextSection','TreasureSection','NotesSection','Environment','Proficiency','Feat','Feature','Tracked','Trait','AuthenticationToken','ChatRoom','ChatMessage','PlayerText','PointOfInterest','MonsterAbilityScore','Monster','NPC','EncounterItem','Presence','Message','MapsAndImagesSection','MapOrImage','CampaignMapOrImage','Exhibit','EncounterMagicItem'
        ]
    },
    notes: {
        type: {
            chat: 'chat',
            default: 'default'
        }
    }
};
