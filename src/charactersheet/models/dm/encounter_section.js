import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';

/**
 * A Root Level DM Object containing overview information about a campaign.
 */
export class EncounterSection extends KOModel {
    static __skeys__ = ['core', 'resources', 'encounterSections'];

    static mapping = {
        include: ['coreUuid']
    };

    toSectionValues = () => {
        const values = this.exportValues();
        return {
            ...values,
            visible: values.defaultVisibility
        };
    };
}
