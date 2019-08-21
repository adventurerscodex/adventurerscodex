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
        name: 'profile',
        refreshOn: Notifications.profile.changed,
        shouldRefresh: (profile) => {
            return !profile || !!profile.characterName();
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.profile.playerName.changed,
        shouldRefresh: (core) => {
            return !core || !!core.playerName();
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        shouldRefresh: () => true
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerimage.changed,
        shouldRefresh: () => true
    }, {
        name: 'armorClass',
        refreshOn: Notifications.armorClass.changed,
        shouldRefresh: () => true
    }, {
        name: 'gold',
        refreshOn: Notifications.wealth.changed,
        shouldRefresh: (wealth) => true
    }, {
        name: 'health',
        refreshOn: Notifications.health.changed,
        shouldRefresh: (health) => true
    }, {
        name: 'hitDiceType',
        refreshOn: Notifications.hitdice.changed,
        shouldRefresh: (hitDice) => {
            return !hitDice || !!hitDice.type();
        }
    }, {
        name: 'passivePerception',
        refreshOn: Notifications.skill.changed,
        shouldRefresh: (skill) => {
            return !skill || skill.name().toLowerCase() === 'perception';
        }
    }, {
        name: 'passiveIntelligence',
        refreshOn: Notifications.abilityscore.changed,
        shouldRefresh: (abilityScore) => {
            return !abilityScore || abilityScore.name() === Fixtures.abilityScores.constants.intelligence.name;
        }
    }, {
        name: 'spellstats',
        refreshOn: Notifications.spellstats.changed,
        shouldRefresh: (spellStats) => {
            return !spellStats || !!spellStats.spellSaveDc();
        }
    }, {
        name: 'statusLine',
        refreshOn: Notifications.status.changed,
        shouldRefresh: (status) => true
    }
];
