import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class AbilityScore extends KOModel {
    static __skeys__ = ['core', 'abilityScores'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    value = ko.observable(1);
    shortName = ko.observable('');

    getModifier() {
        if (this.value()) {
            return Math.floor((this.value() - 10) / 2);
        } else {
            return 0;
        }
    }

    modifierLabel() {
        try {
            if (this.value() === null || this.value() === '') {
                return '';
            }
            let modifier = this.getModifier();
            if (modifier >= 0) {
                modifier = '+ ' + modifier;
            } else {
                modifier = '- ' + Math.abs(modifier);
            }
            return modifier;
        } catch (e) {
            // Ignore
        }
    }
}
