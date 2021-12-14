import { DataRepository } from 'charactersheet/utilities';
import { AbstractChildEncounterFormModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';
import { get } from 'lodash';


export class AbstractTreasureFormViewModel extends AbstractChildEncounterFormModel {

    treasureClass() {
        throw new Error('Subclasses must override this field.')
    }

    treasureType() {
        throw new Error('Subclasses must override this field.')
    }

    // Overrides

    generateBlank() {
        const newEntity = super.generateBlank();
        newEntity.uuid(this.encounter().uuid());

        const treasureClass = this.treasureClass();
        newEntity.value(new treasureClass());
        newEntity.type(this.treasureType());
        return newEntity;
    }

    populate = (label, value) => {
        const item = DataRepository[this.prePopSource][label];
        this.entity().value().importValues(item);
        this.showDisclaimer(true);
        this.forceCardResize();
    };

    validation = {
        // Deep copy of properties in object
        ...get(this.treasureClass(), 'validationConstraints.fieldParams', {})
    };

}
