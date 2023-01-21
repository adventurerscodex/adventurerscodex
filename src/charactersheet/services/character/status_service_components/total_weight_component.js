import {
    AbilityScore,
    Armor,
    Item,
    MagicItem,
    Wealth,
    Weapon } from 'charactersheet/models';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';

import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Status } from 'charactersheet/models/common/status';
import ko from 'knockout';
import { reduce } from 'lodash';

/**
 * A Status Service Component that tracks the total weight that a character
 * is carrying, and any modifiers that are applied due to this weight.
 */
export function TotalWeightStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Encumbrance';
    self.strength = ko.observable();
    self.wealth = ko.observable();
    self.allMass = ko.observableArray([]);


    self.init = async function() {
        await self.load();
        self.setUpSubscriptions();
        // Calculate the first one.
    };

    self.setUpSubscriptions = () => {
        Notifications.abilityscore.changed.add(self.abilityScoreChanged);
        Notifications.wealth.changed.add(self.wealthChanged);

        Notifications.armor.added.add(self.massAdded);
        Notifications.armor.changed.add(self.massChanged);
        Notifications.armor.deleted.add(self.massDeleted);

        Notifications.item.added.add(self.itemMassAdded);
        Notifications.item.changed.add(self.itemMassChanged);
        Notifications.item.deleted.add(self.itemMassDeleted);

        Notifications.magicitem.added.add(self.massAdded);
        Notifications.magicitem.changed.add(self.massChanged);
        Notifications.magicitem.deleted.add(self.massDeleted);

        Notifications.weapon.added.add(self.massAdded);
        Notifications.weapon.changed.add(self.massChanged);
        Notifications.weapon.deleted.add(self.massDeleted);
        Notifications.coreManager.changing.add(self.reload);
    };

    self.load = async (core) => {
        let activeCore;
        if (core) {
            activeCore = core;
        } else {
            activeCore = CoreManager.activeCore();
        }
        if (ko.utils.unwrapObservable(activeCore.type.name) !== 'character') {
            return;
        }
        self.strength(new AbilityScore());
        self.wealth(new Wealth());

        const coreKey = activeCore.uuid();
        const strResponse = await AbilityScore.ps.list({coreUuid: coreKey, name: Fixtures.abilityScores.constants.strength.name});
        const score = strResponse.objects[0];
        self.strength().importValues(score.exportValues());
        await self.wealth().load({ uuid: coreKey });

        self.allMass.removeAll();
        const armorResponse = await Armor.ps.list({ coreUuid: coreKey });
        self.allMass.push(...armorResponse.objects);

        const itemResponse = await Item.ps.list({ coreUuid: coreKey });
        self.allMass.push(...itemResponse.objects);

        const magicItemResponse = await MagicItem.ps.list({ coreUuid: coreKey });
        self.allMass.push(...magicItemResponse.objects);

        const weaponResponse = await Weapon.ps.list({ coreUuid: coreKey });
        self.allMass.push(...weaponResponse.objects);
        self._updateStatus(coreKey);

    };

    self.reload = (oldCore, newCore) => {
        self.strength(null);
        self.wealth(null);
        self.allMass.removeAll();
        self._removeStatus(oldCore.uuid());
        self.load(newCore);
    };

    self.abilityScoreChanged = function (abilityScore) {
        if (abilityScore.name() === Fixtures.abilityScores.constants.strength.name) {
            self.strength().importValues(abilityScore.exportValues());
            self._updateStatus(abilityScore.coreUuid());
        }
    };

    self.wealthChanged = function (wealth) {
        self.wealth().importValues(wealth.exportValues());
        self._updateStatus(wealth.uuid());
    };

    self.massAdded = function (item) {
        if (item) {
            const existingItem = find(self.allMass(), (mass)=> {
                return ko.utils.unwrapObservable(item).uuid() === ko.utils.unwrapObservable(mass).uuid();
            });
            if (!existingItem) {
                self.allMass.push(item);
                self._updateStatus(item.coreUuid());
            } else {
                // the mass was already added. change it instead
                self.massChanged(item);
            }
        }
    };

    self.massDeleted = function (item) {
        if (item) {
            self.allMass.remove(
                (entry) => {
                    return ko.utils.unwrapObservable(entry.uuid) === ko.utils.unwrapObservable(item.uuid);
                });
            self._updateStatus(item.coreUuid());
        }
    };

    self.massChanged = function (item) {
        if (item) {
            Utility.array.updateElement(self.allMass(), item, ko.utils.unwrapObservable(item.uuid));
            self._updateStatus(item.coreUuid());
        }
    };

    self.itemMassAdded = function (item) {
        if (item) {
            if (item.hasParent()) {
                const parent = find(self.allMass(), (mass)=> {
                    return ko.utils.unwrapObservable(item).parentUuid() === ko.utils.unwrapObservable(mass).uuid();
                });
                self.massChanged(parent);
            } else {
                self.massAdded(item);
            }
        }
    };

    self.itemMassChanged = function (item) {
        if (item) {
            if (item.hasParent()) {
                const parent = find(self.allMass(), (mass)=> {
                    return ko.utils.unwrapObservable(item).parentUuid() === ko.utils.unwrapObservable(mass).uuid();
                });
                self.massDeleted(item);
                self.massChanged(parent);
            } else if (!item.isContainer()) {
                // Abusing the fact that massAdded defensively calls massChanged if the item already exists
                self.massAdded(item); 
            } else {
                self.massChanged(item);
            }
        }
    };

    self.itemMassDeleted = function (item) {
        if (item) {
            if (item.hasParent()) {
                const parent = find(self.allMass(), (mass)=> {
                    return ko.utils.unwrapObservable(item).parentUuid() === ko.utils.unwrapObservable(mass).uuid();
                });
                self.massChanged(parent);
            } 
            self.massDeleted(item);
        }
    };

    /**
     * This method generates and persists a status that reflects
     * the character's encumbrance.
     */

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

    self._updateStatus = async (coreKey) => {
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', coreKey),
                new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(coreKey);
            status.identifier(self.statusIdentifier);
        }

        let weight = 0;
        weight += self.getWeightForWealth();
        weight += self.getWeightForMass();
        weight.toFixed(1);
        status.name(self.getDescription(weight));
        status.type(self.getType(self.strength().value(), weight));

        status.save();
        Notifications.status.changed.dispatch();
    };

    self._removeStatus = function(coreKey) {
        var key = CoreManager.activeCore().uuid();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
                new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (status) {
            status.delete();
            Notifications.status.changed.dispatch();
        }
    };

    self.getWeightForMass = () => {
        return reduce(self.allMass(), (a, b) => (
            a + b.totalWeight()
        ), 0);
    };

    self.getWeightForWealth = () => {
        return self.wealth().totalWeight();
    };
}
