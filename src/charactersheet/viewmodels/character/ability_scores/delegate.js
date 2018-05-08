import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { AbilityScore } from 'charactersheet/models/character/ability_score';
import ko from 'knockout';

export class AbilityScoresViewModelDelegate {
    /**
     * This method takes care of persisting the updated ability scores and sending out relevant
     * notifications.
     *
     * @param {AbilityScore[]} oldScores initial ability scores
     * @param {AbilityScore[]} newScores updated ability scores
     * @returns {AbilityScore[]} an array of the most up to date ability scores
     */
    abilityScoresDidChange = async (oldScores, newScores) => {
        const scoresModified = await this.updateAbilityScores(oldScores, newScores);

        if (scoresModified) {
            Notifications.abilityScores.changed.dispatch();
            var key = CoreManager.activeCore().uuid();
            const response = await AbilityScore.ps.list({coreUuid: key});
            return response.objects;
        } else {
            return oldScores;
        }
    };

    /**
     * Checks if an ability score actually changed its value. If it has, it updates the score
     * and sets the scoresModified flag.
     *
     * @param {AbilityScore[]} oldScores initial ability scores
     * @param {AbilityScore[]} newScores updated ability scores
     * @returns {boolean} scoresModified indicates wether any of the ability scores were updated
     */
    updateAbilityScores = (oldScores, newScores) => {
        let scoresModified = false;
        oldScores.forEach(async (old, i, _) => {
            let newScore = newScores.filter((element) => {
                return old.shortName() === element.shortName();
            })[0];

            if (newScore.value() != old.value()) {
                scoresModified = true;
                const response = await newScore.ps.save();
                this.sendNotifications(response.object);
            }
        });
        return scoresModified;
    }

    /**
     * This method takes care of sending out relevant notifications based on the ability score.
     * @param score updated ability score
     * @returns void
     */
    sendNotifications = (score) => {
        if (score.shortName() === 'INT') {
            Notifications.abilityScores.intelligence.changed.dispatch();
        } else if (score.shortName() === 'DEX') {
            Notifications.abilityScores.dexterity.changed.dispatch();
        }
    };
}