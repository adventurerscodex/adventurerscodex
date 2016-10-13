var AppearanceFixture = {
    'height':'5\'1"',
    'weight':'123',
    'hairColor':'Brown',
    'eyeColor':'Blue',
    'skinColor':'Red'
};

var AbilitiesFixture = {
    'str': 12,
    'dex': 13,
    'con': 14,
    'int': 16,
    'wis': 15,
    'cha': 18
};

var FeatsProfFixture = {
    'feats': 'tough',
    'proficiencies': 'simple weapons',
    'specialAbilities': 'darkvision'
};

var SpellStatsFixture = {
    'spellcastingAbility':'INT',
    'spellSaveDc':3,
    'spellAttackBonus':4,
};

var ArmorFixture = {
    armorName: 'shield of stuff'
};

var CampaignFixture = {
    campaignName: 'Hoard of the Dragon Queen',
    dmName: 'Brian Schrader',
    campaignSummary: 'Hoard of the Dragon Queen by Brian Schrader'
};

var PlayerSummaryFixture = {
    id: '123456',
    playerName:'testing',
    characterName:'yes man',
    level: 1,
    profileImage: null
};

var ImageFixture = {
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLMAAANeCAYAA',
    imageUrl: '123',
    characterId: '12345'
};

var PlayerInfoFixture = {
    email: 'brian@brianschrader.com',
    characterId: '12345',
    gravatarUrl: 'http://www.gravatar.com/avatar/11b074a636e00292c98e3e60f7e16595?d=mm'
};

var WeaponFixture = {
    characterId: '123',
    weaponName: 'sword of swording',
    weaponType: 'sword',
    weaponDmg: '+2',
    weaponHandedness: '' ,
    weaponProficiency: false,
    weaponPrice: 23,
    weaponWeight: 23,
    weaponHit: 0,
    weaponRange: '2ft',
    weaponSize: 'large',
    weaponDamageType: 'slash',
    weaponProperty: null,
    weaponDescription: ''
};

var MagicItemFixture = {
    magicItemName: 'Dagger of venom',
    magicItemType: 'Wondrous Item',
    magicItemRarity: 'Very Rare',
    magicItemRequiresAttunement: true,
    magicItemAttuned: false,
    magicItemMaxCharges: 3,
    magicItemCharges: 1,
    magicItemWeight: 5,
    magicItemDescription: 'Deadly dagger'
};

var ProfileFixture = {
    characterId: '1234',
    playerName: 'Joe Blow',
    characterName: 'Chrisopolis Jed',
    race: 'Dragonborn',
    gender: 'female',
    level: 2,
    typeClass: 'Wizard',
};

var NPCFixture = {
    characterId: '1234',
    npcId: '1234222',
};

var MessageFixture = {
    'to': 'hi',
    toId: 'hah',
    from: 'dodo',
    fromId: 'wooo',
    text: 'test message'
};

var SortServiceFixture = {
    data: [
        {
            name: ko.observable('Abe'),
            age: ko.observable(1),
            dead: ko.observable(true)
        },
        {
            name: ko.observable('Roxanne'),
            age: ko.observable(2),
            dead: ko.observable(false)
        },
        {
            name: ko.observable('John'),
            age: ko.observable(13),
            dead: ko.observable(true)
        },
        {
            name: ko.observable('Tiff'),
            age: ko.observable(133),
            dead: ko.observable(false)
        },
        {
            name: ko.observable('Nate'),
            age: ko.observable(12),
            dead: ko.observable(true)
        },
    ]

}

var CharacterFixture = {
    'key': '18c286fa-3ce6-49e9-99cc-4710118915ff',
    'isDefault': true,
    'isActive': true,
    'playerType': {
        'key': 'character',
        'visibleTabs': [
            'profile',
            'stats',
            'skills',
            'spells',
            'equipment',
            'inventory',
            'notes',
            'settings',
            'party'
        ],
        'defaultTab': 'stats'
    }
};

var DMCharacterFixture = {
    'key': '18c286fa-3ce6-49e9-99cc-4710118915ff',
    'isDefault': true,
    'isActive': true,
    'playerType': {
        'key': 'dm',
        'visibleTabs': [
            'profile',
            'stats',
            'skills',
            'spells',
            'equipment',
            'inventory',
            'notes',
            'settings',
            'party'
        ],
        'defaultTab': 'campaign'
    }
};

var HealthFixture = {
  'characterId': '507a7252-4128-43d3-bd38-b264f9b493f5',
  'maxHitpoints': '9',
  'tempHitpoints': 0,
  'damage': '1',
};

OtherStatsFixture = {
  'characterId': '507a7252-4128-43d3-bd38-b264f9b493f5',
  'ac': '13',
  'initiative': 0,
  'speed': '35',
  'inspiration': 0,
  'proficiency': '2'
};

var MockLocalStorage = {
    __master__: "[\"Character\",\"Profile\",\"PlayerInfo\",\"Skill\",\"Item\",\"CharacterAppearance\",\"FeaturesTraits\",\"Health\",\"OtherStats\",\"DeathSave\",\"HitDiceType\",\"AbilityScores\",\"SavingThrows\",\"SpellStats\",\"FeatsProf\",\"Treasure\",\"Note\",\"HitDice\",\"Spell\",\"Armor\",\"Slot\",\"Weapon\",\"DailyFeature\",\"ImageModel\"]",
    Skill: "{\"18\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Acrobatics\",\"abilityScore\":\"Dex\",\"modifier\":null},\"19\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Animal Handling\",\"abilityScore\":\"Wis\",\"modifier\":null},\"20\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Arcana\",\"abilityScore\":\"Int\",\"modifier\":null},\"21\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Athletics\",\"abilityScore\":\"Str\",\"modifier\":null},\"22\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Deception\",\"abilityScore\":\"Cha\",\"modifier\":null},\"23\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"History\",\"abilityScore\":\"Int\",\"modifier\":null},\"24\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Insight\",\"abilityScore\":\"Wis\",\"modifier\":null},\"25\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Intimidation\",\"abilityScore\":\"Cha\",\"modifier\":null},\"26\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Investigation\",\"abilityScore\":\"Int\",\"modifier\":null},\"27\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Medicine\",\"abilityScore\":\"Wis\",\"modifier\":null},\"28\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Nature\",\"abilityScore\":\"Int\",\"modifier\":null},\"29\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Perception\",\"abilityScore\":\"Wis\",\"modifier\":null},\"30\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Performance\",\"abilityScore\":\"Cha\",\"modifier\":null},\"31\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Persuasion\",\"abilityScore\":\"Cha\",\"modifier\":null},\"32\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Religion\",\"abilityScore\":\"Int\",\"modifier\":null},\"33\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Sleight of Hand\",\"abilityScore\":\"Dex\",\"modifier\":null},\"34\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Stealth\",\"abilityScore\":\"Dex\",\"modifier\":null},\"35\":{\"characterId\":\"f563af87-1382-479d-8bb8-5f61145fc84d\",\"name\":\"Survival\",\"abilityScore\":\"Wis\",\"modifier\":null}}"
};

var mock_110_migration = {
    name: 'TESTING MIGRATION',
    version: '1.1.0',
    migration: function() {
        // Change all skill names to "Test"
        PersistenceService._findAllObjs('Skill').forEach(function(e, i, _) {
            e.data.name = 'Test';
            PersistenceService.saveObj('Skill', e.data, e.id);
            console.log('HI')
        });
    }
};

var mock_110_migration_fail = {
    name: 'TESTING MIGRATION',
    version: '1.1.0',
    migration: function() {
        // Change all skill names to "Test"
        PersistenceService._findAllObjs('Skill').forEach(function(e, i, _) {
            e.data.name = 'Test';
            PersistenceService.saveObj('Skill', e.data, e.id);
            console.log('HI');
        });
        throw 'ERROR';
    }
};

var mock_134_migration = {
    name: 'TESTING MIGRATION',
    version: '1.3.0',
    migration: function() {

    }
};

var skillDataFixture = [
    {
        id: 0,
        data: {
            proficiency: true
        }
    }, {
        id: 1,
        data: {
            proficiency: false
        }
    }
];

var statDataFixture = [
    {
        id: 0,
        data: {
            proficiency: 7
        }
    }
];

var spellDataFixture = [
    {
        id: 0,
        data: {
            spellType: 'Attack Roll',
            spellSchool: 'Cantrip',
            spellDuration: '1 min',
            spellRange: '5 ft'
        }
    }
];


var weaponDataFixture = [
    {
        id: 0,
        data: {
            weaponHandedness: 'Light',
        }
    }, {
        id: 1,
        data: {
            weaponHandedness: 'Heavy',
        }
    }
];
