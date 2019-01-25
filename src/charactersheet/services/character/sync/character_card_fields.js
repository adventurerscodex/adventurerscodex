import 'babel-polyfill';
import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { ArmorClassService } from 'charactersheet/services/character/armor_class_service';
import { Health } from 'charactersheet/models/character/health';
import { HitDice } from 'charactersheet/models/character/hit_dice';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Profile } from 'charactersheet/models/character/profile';
import { ProfileImage } from 'charactersheet/models/common/player_image';
import { Skill } from 'charactersheet/models/character/skill';
import { SpellStats } from 'charactersheet/models/character/spell_stats';
import { Status } from 'charactersheet/models/common/status';
import { Utility } from 'charactersheet/utilities/convenience';
import { Wealth } from 'charactersheet/models/common/wealth';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';

export var CharacterCardFields = [
    {
        name: 'publisherJid',
        refreshOn: Notifications.item.changed,
        valueAccessor: async () => {
            var xmpp = XMPPService.sharedService();
            return xmpp.connection.jid;
        }
    }, {
        name: 'name',
        refreshOn: Notifications.profile.characterName.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.characterName() : '';
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.profile.playerName.changed,
        valueAccessor: async () => {
            const core = CoreManager.activeCore();
            return core ? core.playerName() : '';
        }
    }, {
        name: 'playerSummary',
        refreshOn: Notifications.profile.characterName.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.summary() : '';
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: async () => {
            var character = CoreManager.activeCore();
            return character ? character.type.name() : 'character';
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerImage.changed,
        valueAccessor: async () => {
            var defaultImage = 'https://www.gravatar.com/avatar/{}?d=mm';
            const imageResponse = await ProfileImage.ps.read({uuid: CoreManager.activeCore().uuid()});
            const image = imageResponse.object;

            if (!image) {
                return defaultImage;
            } else if (image.type() === 'url') {
                var convertedImage = Utility.string.createDirectDropboxLink(image.sourceUrl());
                return convertedImage !== '' ? convertedImage : defaultImage;
            } else if (image.type() === 'email') {
                return image.gravatarUrl() ? image.gravatarUrl() : defaultImage;
            } else {
                return defaultImage;
            }
        }
    }, {
        name: 'race',
        refreshOn: Notifications.profile.race.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.race() : '';
        }
    }, {
        name: 'playerClass',
        refreshOn: Notifications.profile.playerClass.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.characterClass() : '';
        }
    }, {
        name: 'level',
        refreshOn: Notifications.profile.level.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.level() : '';
        }
    }, {
        name: 'experience',
        refreshOn: Notifications.profile.experience.changed,
        valueAccessor: async () => {
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            return profile ? profile.experience() : '';
        }
    }, {
        name: 'armorClass',
        refreshOn: Notifications.armorClass.changed,
        valueAccessor: async () => {
            var acService = ArmorClassService.sharedService();
            return acService.armorClass() ? acService.armorClass() : 0;
        }
    }, {
        name: 'gold',
        refreshOn: Notifications.wealth.changed,
        valueAccessor: async () => {
            const response = await Wealth.ps.read({uuid: CoreManager.activeCore().uuid()});
            const wealth = response.object;
            return wealth ? wealth.worthInGold() : 0;
        }
    }, {
        name: 'maxHitPoints',
        refreshOn: Notifications.health.maxHitPoints.changed,
        valueAccessor: async () => {
            const healthResponse = await Health.ps.read({uuid: CoreManager.activeCore().uuid()});
            const health = healthResponse.object;
            return health ? health.maxHitPoints() : 0;
        }
    }, {
        name: 'damage',
        refreshOn: Notifications.health.damage.changed,
        valueAccessor: async () => {
            const healthResponse = await Health.ps.read({uuid: CoreManager.activeCore().uuid()});
            const health = healthResponse.object;
            return health ? health.damage() : 0;
        }
    }, {
        name: 'tempHitPoints',
        refreshOn: Notifications.health.tempHitPoints.changed,
        valueAccessor: async () => {
            const healthResponse = await Health.ps.read({uuid: CoreManager.activeCore().uuid()});
            const health = healthResponse.object;
            return health ? health.tempHitPoints() : 0;
        }
    }, {
        name: 'hitDiceType',
        refreshOn: Notifications.hitDiceType.changed,
        valueAccessor: async () => {
            const hitDiceResponse = await HitDice.ps.read({uuid: CoreManager.activeCore().uuid()});
            const hitDiceType = hitDiceResponse.object;
            return hitDiceType ? hitDiceType.type() : '';
        }
    }, {
        name: 'hitDice',
        refreshOn: Notifications.hitDice.changed,
        valueAccessor: async () => {
            const hitDiceResponse = await HitDice.ps.read({uuid: CoreManager.activeCore().uuid()});
            const hitDice = hitDiceResponse.object;
            const profileResponse = await Profile.ps.read({uuid: CoreManager.activeCore().uuid()});
            const profile = profileResponse.object;
            if (!hitDice || !profile) { return; }
            return hitDice.used() + '/' + profile.level();
        }
    }, {
        name: 'passivePerception',
        refreshOn: Notifications.skills.perception.changed,
        valueAccessor: async () => {
            const skillResponse = await Skill.ps.list({coreUuid: CoreManager.activeCore().uuid(), name: 'Perception'});
            var skill = skillResponse.objects[0];
            await skill.updateBonuses();
            return skill ? skill.passiveBonus() : 0;
        }
    }, {
        name: 'passiveIntelligence',
        refreshOn: Notifications.abilityScores.intelligence.changed,
        valueAccessor: async () => {
            const response = await AbilityScore.ps.list({coreUuid: CoreManager.activeCore().uuid(), name: Fixtures.abilityScores.constants.intelligence.name});
            const score = response.objects[0];
            var modifier = score.getModifier();
            return modifier ? 10 + modifier : 0;
        }
    }, {
        name: 'spellSaveDC',
        refreshOn: Notifications.spellStats.changed,
        valueAccessor: async () => {
            var spellStatsResponse = await SpellStats.ps.read({uuid: CoreManager.activeCore().uuid()});
            var spellStats = spellStatsResponse.object;
            return spellStats ? spellStats.spellSaveDc() : 0;
        }
    }, {
        name: 'healthinessStatus',
        refreshOn: Notifications.status.healthiness.changed,
        valueAccessor: async () => {
            var predicates = [
                new KeyValuePredicate('characterId', CoreManager.activeCore().uuid()),
                new KeyValuePredicate('identifier', 'Status.Healthiness')
            ];
            var healthinessStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return healthinessStatus ? healthinessStatus.exportValues() : null;
        }
    }, {
        name: 'magicStatus',
        refreshOn: Notifications.status.magic.changed,
        valueAccessor: async () => {
            var predicates = [
                new KeyValuePredicate('characterId', CoreManager.activeCore().uuid()),
                new KeyValuePredicate('identifier', 'Status.Magical')
            ];
            var magicStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return magicStatus ? magicStatus.exportValues() : null;
        }
    }, {
        name: 'trackedStatus',
        refreshOn: Notifications.status.tracked.changed,
        valueAccessor: async () => {
            var predicates = [
                new KeyValuePredicate('characterId', CoreManager.activeCore().uuid()),
                new KeyValuePredicate('identifier', 'Status.Tracked')
            ];
            var trackedStatus = PersistenceService.findByPredicates(Status, predicates)[0];
            return trackedStatus ? trackedStatus.exportValues() : null;
        }
    }
];
