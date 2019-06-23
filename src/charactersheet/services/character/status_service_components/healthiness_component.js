import { CoreManager, Notifications } from 'charactersheet/utilities';
import { DeathSave, Health, HitDice, Profile } from 'charactersheet/models';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { find } from 'lodash';
import { getHealthTypeEnum } from 'charactersheet/models/common/status_weight_pair';
import ko from 'knockout';

/**
 * A Status Service Component that calculates the player's overall healthiness.
 * Hit Dice will have a weight of 30% and Hit Points will have a weight 70%.
 */

export function HealthinessStatusServiceComponent() {
    var self = this;

    self.statusIdentifier = 'Status.Healthiness';
    self.HEALTH_WEIGHT = 0.85;
    self.HIT_DICE_WEIGHT = 0.15;


    self.health = ko.observable();
    self.deathSaveFailure = ko.observable();
    self.hitDice = ko.observable();
    self.profile = ko.observable();

    self.init = function() {
        self.health(new Health());
        self.deathSaveFailure(new DeathSave());
        self.hitDice(new HitDice());
        self.profile(new Profile());

        Notifications.health.changed.add(self.healthChanged);
        Notifications.hitdice.changed.add(self.hitDiceChanged);
        Notifications.deathsave.changed.add(self.deathSaveChanged);
        Notifications.profile.changed.add(self.profileChanged);
        Notifications.coreManager.changed.add(self.load);
        self.load();
    };

    self.load = async () => {
        self.deathSaveFailure(new DeathSave());
        self.health(new Health());
        self.hitDice(new HitDice());
        self.profile(new Profile());

        var key = CoreManager.activeCore().uuid();
        var status = PersistenceService.findByPredicates(Status,
                [new KeyValuePredicate('characterId', key),
                new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }
        await self.health().load({uuid: key});
        await self.profile().load({uuid: key});
        await self.hitDice().load({uuid: key});
        const deathSaves = await DeathSave.ps.list({coreUuid: key});
        self.deathSaveFailure(find(deathSaves.objects, (save) => save.type() === 'failure'));
        self._updateStatus();
    };

    self.healthChanged = (health) => {
        self.health().importValues(health.exportValues());
        self._updateStatus();
    };

    self.hitDiceChanged = (hitDice) => {
        self.hitDice().importValues(hitDice.exportValues());
        self._updateStatus();
    };

    self.deathSaveChanged = (deathSave) => {
        if (deathSave.type() === 'failure') {
            self.deathSaveFailure().importValues(deathSave.exportValues());
            self._updateStatus();
        }
    };

    self.profileChanged = (profile) => {
        self.profile().importValues(profile.exportValues());
        self._updateStatus();
    };

    /* Private Methods */
    self._updateStatus = async function() {
        var key = CoreManager.activeCore().uuid();
        var status = PersistenceService.findByPredicates(Status,
            [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)])[0];
        if (!status) {
            status = new Status();
            status.characterId(key);
            status.identifier(self.statusIdentifier);
        }

        var weightedTotal = self._getWeightedTotal(
            self.health(),
            self.hitDice(),
            self.profile(),
            self.deathSaveFailure(),
        ).toFixed(2);

        var phrase = StatusWeightPair.determinePhraseAndColor(getHealthTypeEnum(), weightedTotal);

        status.name(phrase.status);
        status.type(phrase.color);
        status.value(weightedTotal);

        status.save();
        Notifications.status.changed.dispatch();
        Notifications.status.healthiness.changed.dispatch();
    };

    /**
     * This method calculates the weighted values and performs special handling
     * for dead, unconscious and stable, and unconscious states.
     */
    self._getWeightedTotal = function(healthParam, hitDiceParam, profileParam, deathSaveFailureParam) {
        const health = ko.utils.unwrapObservable(healthParam);
        const hitDice = ko.utils.unwrapObservable(hitDiceParam);
        const profile = ko.utils.unwrapObservable(profileParam);
        const deathSaveFailure = ko.utils.unwrapObservable(deathSaveFailureParam);

        var valueWeightPairs = [];
        // Character is in a state of no health after character creation
        if (!health) {
            return 1;
        }

        // Character is dead
        if (deathSaveFailure.used() >= 3) {
            return -2;
        }

        // Character is unconscious and stable
        if (health.dying()) {
            return 0.0;
        }

        // Character is unconscious
        if (health.regularHitPointsRemaining() <= 0) {
            return -1; // why? I swapped with 0.0 (above)
        }

        if (health) {
            valueWeightPairs.push(self.prepareHealthValueWeightPairs(health));
        }

        if (hitDice) {
            valueWeightPairs.push(self.prepareHitDiceValueWeightPairs(hitDice, profile));
        }

        var weightedTotal = StatusWeightPair.processStatusWeights(valueWeightPairs);

        return weightedTotal;
    };

    /**
     * Returns a decimal that represents the total Hit Points a player has.
     *
     * @param health  active character's Health model
     * @return StatusWeightPair
     */
    self.prepareHealthValueWeightPairs = function(health) {
        var value = health.hitPoints() / health.totalHitPoints();

        return new StatusWeightPair(value, self.HEALTH_WEIGHT);
    };

    /**
     * Returns a decimal that represents the total amount of un-used Hit Dice a player has.
     *
     * @param hitDiceList  active character's list of HitDice models
     * @return StatusWeightPair
     */
    self.prepareHitDiceValueWeightPairs = function(hitDice, profile) {
        var value = (profile.level() - hitDice.used()) / profile.level();

        return new StatusWeightPair(value, self.HIT_DICE_WEIGHT);
    };
}
