import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import { Armor } from 'charactersheet/models/common/armor';
import { Item } from 'charactersheet/models/common/item';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { MagicItem } from 'charactersheet/models/common/magic_item';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { Wealth } from 'charactersheet/models/common/wealth';
import { Weapon } from 'charactersheet/models/common/weapon';
import ko from 'knockout';

/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
export function TotalWeightStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Encumbrance';

    self.init = function() {
        Notifications.profile.changed.add(self.dataHasChanged);
        Notifications.armor.changed.add(self.dataHasChanged);
        Notifications.weapon.changed.add(self.dataHasChanged);
        Notifications.item.changed.add(self.dataHasChanged);
        Notifications.magicItem.changed.add(self.dataHasChanged);
        Notifications.wealth.changed.add(self.dataHasChanged);
        // Calculate the first one.
        self.dataHasChanged();
    };

    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */
    self.dataHasChanged = async () => {
        var coreUuid = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({coreUuid, name: Fixtures.abilityScores.constants.strength.name});
        const score = response.objects[0];
        if (!score) {
            self._removeStatus();
        } else {
            self._updateStatus(score);
        }
    };

    self.getDescription = function(weight) {
        if (weight === 0) {
            return 'carrying nothing';
        }
        return 'carrying ~' + String(weight) + 'lbs';
    };

    self.getType = function(strength, weight) {
        if (weight === 0) {
            return 'default';
        } else if (weight < strength * 5) {
            return 'info';
        } else if (weight < strength * 10) {
            return 'warning';
        } else {
            return 'danger';
        }
    };

    /* Private Methods */

    self._updateStatus = async (score) => {
        var key = CoreManager.activeCore().uuid();

        var weight = 0;

        weight += await self.getWeightForArmors();
        weight += await self.getWeightForWeapons();
        weight += await self.getWeightForItems();
        weight += await self.getWeightForMagicItems();
        weight += await self.getWeightForWealth();

        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        status.name(self.getDescription(weight));
        status.type(self.getType(score.value(), weight));

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function() {
        var key = CoreManager.activeCore().uuid();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };

    self.getWeightForArmors = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Armor.ps.list({coreUuid: key});
        const armors = response.objects;
        var weight = 0;
        armors.forEach(function(armor) {
            var weightValue = parseFloat(armor.weight());
            if (weightValue) {
                weight += weightValue;
            }
        });
        return weight;
    };

    self.getWeightForWeapons = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Weapon.ps.list({coreUuid: key});
        const weapons = response.objects;
        var weight = 0;
        weapons.forEach(function(weapon) {
            var weightValue = parseFloat(weapon.weight()) * weapon.quantity();
            if (weightValue) {
                weight += weightValue;
            }
        });
        return weight;
    };

    self.getWeightForItems = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Item.ps.list({coreUuid: key});
        const items = response.objects;
        var weight = 0;
        items.forEach(function(item) {
            var weightValue = parseFloat(item.weight()) * item.quantity();
            if (weightValue) {
                weight += weightValue;
            }
        });
        return weight;
    };

    self.getWeightForMagicItems = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await MagicItem.ps.list({coreUuid: key});
        const magicItems = response.objects;
        var weight = 0;
        magicItems.forEach(function(magicItem) {
            var weightValue = parseFloat(magicItem.weight());
            if (weightValue) {
                weight += weightValue;
            }
        });
        return weight;
    };

    self.getWeightForWealth = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Wealth.ps.read({uuid: key});
        const wealth = response.object;
        return wealth.totalWeight();
    };
}
