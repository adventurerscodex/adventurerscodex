import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';

export class HitDice extends KOModel {
    static __skeys__ = ['core', 'characters', 'hitDice'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    used = ko.observable(0);
    type = ko.observable('');
    hitDiceOptions = ko.observableArray(Fixtures.hitDiceType.hitDiceOptions);

    save = async () => {
        const response = await this.ps.save();
        Notifications.hitDice.changed.dispatch(this);
        return response;
    }
}

HitDice.validationConstraints = {
    rules: {
        type: {
            required: true,
            maxlength: 32
        }
    }
};
