'use strict';


var CharacterCardFields = [
    {
        name: 'playerName',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.playerName() : '';
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: function() {
            var character = CharacterManager.activeCharacter();
            return character ? character.playerType().key : 'character';
        }
    }, {
        name: 'name',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.characterName() : '';
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var image = PersistenceService.findFirstBy(PlayerImage, 'characterId', CharacterManager.activeCharacter().key());
            if (image.imageSource() === 'link') {
                var imageModel = PersistenceService.findFirstBy(ImageModel, 'characterId', CharacterManager.activeCharacter().key());
                return imageModel ? imageModel.imageUrl() : '';
            } else if (image.imageSource() === 'email') {
                var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CharacterManager.activeCharacter().key());
                return info ? info.gravatarUrl() : '';
            } else {
                return null;
            }
        }
    }, {
        name: 'race',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.race() : '';
        }
    }, {
        name: 'class',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.class() : '';
        }
    }, {
        name: 'level',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.level() : '';
        }
    }, {
        name: 'armorClass',
        refreshOn: Notifications.armorClass.changed,
        valueAccessor: function() {
            var acService = ArmorClassService.sharedService();
            return acService.armorClass() ? acService.armorClass() : 0;
        }
    }, {
        name: 'gold',
        refreshOn: Notifications.treasure.changed,
        valueAccessor: function() {
            var treasure = PersistenceService.findFirstBy(Treasure, 'characterId', CharacterManager.activeCharacter().key());
            return treasure.worthInGold();
        }
    }, {
        name: 'maxHitPoints',
        refreshOn: Notifications.stats.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health.maxHitpoints();
        }
    }, {
        name: 'damage',
        refreshOn: Notifications.stats.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health.damage();
        }
    }, {
        name: 'tempHitPoints',
        refreshOn: Notifications.stats.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health.tempHitpoints();
        }
    }, {
        name: 'hitDiceType',
        refreshOn: Notifications.stats.changed,
        valueAccessor: function() {
            var hitDiceType = PersistenceService.findFirstBy(HitDiceType, 'characterId', CharacterManager.activeCharacter().key());
            return hitDiceType.hitDiceType();
        }
    }, {
        name: 'hitDice',
        refreshOn: Notifications.stats.changed,
        valueAccessor: function() {
            var hitDice = PersistenceService.findFirstBy(HitDice, 'characterId', CharacterManager.activeCharacter().key());
            var totalHitDice = 0;
            hitDice.forEach(function(die, idx, _) {
                if (!die.hitDiceUsed()) {
                    totalHitDice++;
                }
            });
            return totalHitDice + '/' + hitDice.length;
        }
    }, {
        name: 'passivePerception',
        refreshOn: Notifications.skills.changed,
        valueAccessor: function() {
            var predicates = [
                new KeyValuePredicate('characterId', characterId),
                new KeyValuePredicate('name', 'Perception')
            ];
        var skill = PersistenceService.findByPredicates(Skill, predicates)[0];

        return skill ? skill.passiveBonus() : 0;
        }
    }, {
        name: 'passiveIntelligence',
        refreshOn: Notifications.abilityScores.changed,
        valueAccessor: function() {
        var abilityScores = PersistenceService.findFirstBy(AbilityScores, predicates);

        return abilityScores ? 10 + abilityScores.intModifier() : 0;
        }
    }, {
        name: 'spellSaveDC',
        refreshOn: Notifications.spellStats.changed,
        valueAccessor: function() {
            var spellStats = PersistenceService.findFirstBy(SpellStats, 'characterId', CharacterManager.activeCharacter().key());
            return spellStats ? spellStats.spellSaveDc() : 0;
        }
    },
];
