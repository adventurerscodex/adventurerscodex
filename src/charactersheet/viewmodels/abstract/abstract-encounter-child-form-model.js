import { CoreManager } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';

/**
 * A subclass providing all of the child form functionality needed to deal with
 * objects related to Encounters.
 */
export class AbstractChildEncounterFormModel extends AbstractChildFormModel {

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
        if (this.existingData) {
            console.log('BEFORE', this.entity().exportValues())
            this.entity().importValues(this.existingData.exportValues());
            console.log('AFTER', this.entity().exportValues())
        } else {
            this.entity(this.generateBlank());
            const encounterId = this.encounter().uuid();
            this.entity().coreUuid(CoreManager.activeCore().uuid());
            this.entity().encounterUuid(encounterId);
            this.addForm(true);
        }
        this.showDisclaimer(false);
    }
}
