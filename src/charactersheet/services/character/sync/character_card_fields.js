import { AbilityScores } from 'charactersheet/models/character/ability_scores';
import { ArmorClassService } from 'charactersheet/services/character/armor_class_service';
import { CharacterManager } from 'charactersheet/utilities';
import { Health } from 'charactersheet/models/character/health';
import { HitDice } from 'charactersheet/models/character/hit_dice';
import { HitDiceType } from 'charactersheet/models/character/hit_dice_type';
import { ImageModel } from 'charactersheet/models/common/image';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { PlayerImage } from 'charactersheet/models/common/player_image';
import { PlayerInfo } from 'charactersheet/models/common/player_info';
import { Profile } from 'charactersheet/models/character/profile';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import { Skill } from 'charactersheet/models/character/skill';
import { SpellStats } from 'charactersheet/models/character/spell_stats';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { Treasure } from 'charactersheet/models/common/treasure';
import { Utility } from 'charactersheet/utilities/convenience';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';

export var CharacterCardFields = [
    {
        name: 'publisherJid',
        refreshOn: Notifications.item.changed,
        valueAccessor: function() {
            var xmpp = XMPPService.sharedService();
            return xmpp.connection.jid;
        }
    }, {
        name: 'name',
        refreshOn: Notifications.profile.characterName.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.characterName() : '';
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.profile.playerName.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.playerName() : '';
        }
    }, {
        name: 'playerSummary',
        refreshOn: Notifications.profile.characterName.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.summary() : '';
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: function() {
            var character = CharacterManager.activeCharacter();
            return character ? character.playerType().key : 'character';
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerImage.changed,
        valueAccessor: function() {
            var defaultImage = 'https://www.gravatar.com/avatar/{}?d=mm';
            var image = PersistenceService.findFirstBy(PlayerImage, 'characterId', CharacterManager.activeCharacter().key());
            if (!image) { return defaultImage; }
            if (image.imageSource() === 'link') {
                var imageModel = PersistenceService.findFirstBy(ImageModel, 'characterId', CharacterManager.activeCharacter().key());
                if (!imageModel) { return defaultImage; }
                var convertedImage = Utility.string.createDirectDropboxLink(imageModel.imageUrl());
                return convertedImage !== '' ? convertedImage : defaultImage;
            } else if (image.imageSource() === 'email') {
                var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CharacterManager.activeCharacter().key());
                return info ? info.gravatarUrl() : defaultImage;
            } else {
                return defaultImage;
            }
        }
    }, {
        name: 'race',
        refreshOn: Notifications.profile.race.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.race() : '';
        }
    }, {
        name: 'playerClass',
        refreshOn: Notifications.profile.playerClass.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.typeClass() : '';
        }
    }, {
        name: 'level',
        refreshOn: Notifications.profile.level.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.level() : '';
        }
    }, {
        name: 'experience',
        refreshOn: Notifications.profile.experience.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.exp() : '';
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
            return treasure ? treasure.worthInGold() : 0;
        }
    }, {
        name: 'maxHitPoints',
        refreshOn: Notifications.health.maxHitPoints.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health ? health.maxHitpoints() : 0;
        }
    }, {
        name: 'damage',
        refreshOn: Notifications.health.damage.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health ? health.damage() : 0;
        }
    }, {
        name: 'tempHitPoints',
        refreshOn: Notifications.health.tempHitPoints.changed,
        valueAccessor: function() {
            var health = PersistenceService.findFirstBy(Health, 'characterId', CharacterManager.activeCharacter().key());
            return health ? health.tempHitpoints() : 0;
        }
    }, {
        name: 'hitDiceType',
        refreshOn: Notifications.hitDiceType.changed,
        valueAccessor: function() {
            var hitDiceType = PersistenceService.findFirstBy(HitDiceType, 'characterId', CharacterManager.activeCharacter().key());
            return hitDiceType ? hitDiceType.hitDiceType() : '';
        }
    }, {
        name: 'hitDice',
        refreshOn: Notifications.hitDice.changed,
        valueAccessor: function() {
            var hitDice = PersistenceService.findBy(HitDice, 'characterId', CharacterManager.activeCharacter().key());
            if (!hitDice) { return; }
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
        refreshOn: Notifications.skills.perception.changed,
        valueAccessor: function() {
            var predicates = [
                new KeyValuePredicate('characterId', CharacterManager.activeCharacter().key()),
                new KeyValuePredicate('name', 'Perception')
            ];
            var skill = PersistenceService.findByPredicates(Skill, predicates)[0];

            return skill ? skill.passiveBonus() : 0;
        }
    }, {
        name: 'passiveIntelligence',
        refreshOn: Notifications.abilityScores.intelligence.changed,
        valueAccessor: function() {
            var abilityScores = PersistenceService.findFirstBy(AbilityScores, 'characterId', CharacterManager.activeCharacter().key());
            var modifier = abilityScores.modifierFor('int');
            modifier = modifier ? modifier : 0;
            return abilityScores ? 10 + modifier : 0;
        }
    }, {
        name: 'spellSaveDC',
        refreshOn: Notifications.spellStats.changed,
        valueAccessor: function() {
            var spellStats = PersistenceService.findFirstBy(SpellStats, 'characterId', CharacterManager.activeCharacter().key());
            return spellStats ? spellStats.spellSaveDc() : 0;
        }
    }, {
        name: 'healthinessStatus',
        refreshOn: Notifications.status.healthiness.changed,
        valueAccessor: function() {
            var predicates = [
                new KeyValuePredicate('characterId', CharacterManager.activeCharacter().key()),
                new KeyValuePredicate('identifier', 'Status.Healthiness')
            ];
            var healthinessStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return healthinessStatus ? healthinessStatus.exportValues() : null;
        }
    }, {
        name: 'magicStatus',
        refreshOn: Notifications.status.magic.changed,
        valueAccessor: function() {
            var predicates = [
                new KeyValuePredicate('characterId', CharacterManager.activeCharacter().key()),
                new KeyValuePredicate('identifier', 'Status.Magical')
            ];
            var magicStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return magicStatus ? magicStatus.exportValues() : null;
        }
    }, {
        name: 'trackedStatus',
        refreshOn: Notifications.status.tracked.changed,
        valueAccessor: function() {
            var predicates = [
                new KeyValuePredicate('characterId', CharacterManager.activeCharacter().key()),
                new KeyValuePredicate('identifier', 'Status.Tracked')
            ];
            var trackedStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return trackedStatus ? trackedStatus.exportValues() : null;
        }
    }
];
