import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class Proficiency extends KOModel {
    static __skeys__ = ['core', 'proficiencys'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    description = ko.observable('');

    save = async () => {
        const response = await this.ps.save();
        Notifications.proficiency.changed.dispatch(this);
        return response;
    }
}

Proficiency.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            maxlength: 64
        }
    }
};
