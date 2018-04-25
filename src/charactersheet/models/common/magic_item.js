import {
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import ko from 'knockout';
import { KOModel } from 'hypnos';


export class MagicItem extends KOModel {
    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    DESCRIPTION_MAX_LENGTH = 145;

    static __skeys__ = ['core', 'magicItems'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    rarity = ko.observable('');
    requiresAttunement = ko.observable(false);
    attuned = ko.observable(false);
    maxCharges = ko.observable(0);
    usedCharges = ko.observable(0);
    weight = ko.observable(0);
    description = ko.observable('');

    magicItemTypeOptions = ko.observableArray(Fixtures.magicItem.magicItemTypeOptions);
    magicItemRarityOptions = ko.observableArray(Fixtures.magicItem.magicItemRarityOptions);

    chargesDisplay = ko.pureComputed(() => {
        if (this.maxCharges() == 0) {
            return 'N/A';
        }
        else {
            return this.usedCharges();
        }
    });

    magicItemDescriptionHTML = ko.pureComputed(() => {
        if (this.description()){
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    });

    magicItemNameLabel = ko.pureComputed(() => {
        if (this.attuned() === true) {
            return (this.name() + ' (Attuned)' );
        } else {
            return this.name();
        }
    });

    magicItemWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });
}