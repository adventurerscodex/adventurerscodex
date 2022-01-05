import { CoreManager } from 'charactersheet/utilities';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';

/**
 * A subclass providing all of the base form functionality needed to deal with
 * objects related to Encounters.
 */
export class AbstractEncounterTabularViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);

        this.encounter = params.encounter;
    }

    // Overrides

    generateBlank() {
        const newEntity = super.generateBlank();
        newEntity.uuid(this.encounter().uuid());
        return newEntity;
    }

    async refresh() {
        const encounterUuid = this.encounter().uuid();
        const response = await this.modelClass().ps.list({
            coreUuid: this.coreKey,
            encounterUuid,
        });
        this.entities(response.objects);
    }
}
