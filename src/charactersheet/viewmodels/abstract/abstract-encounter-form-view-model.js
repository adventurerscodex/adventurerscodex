import { CoreManager } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';

/**
 * A subclass providing all of the base form functionality needed to deal with
 * objects related to Encounters.
 */
export class AbstractEncounterFormViewModel extends AbstractFormModel {

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
            this.entity().importValues(this.existingData.exportValues());
        } else {
            const coreKey = CoreManager.activeCore().uuid();
            const encounterId = this.encounter().uuid();
            await this.entity().load({coreUuid: coreKey, uuid: encounterId });
        }
    }

    didSave(success, error) {
        super.didSave(success, error);

        if (ko.unwrap(this.entity().isExhibited)) {
            PartyService.updatePresence({ exhibit: this.entity().uuid() });
        }
    }
}
