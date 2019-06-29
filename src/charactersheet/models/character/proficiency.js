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


    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.proficiency.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.proficiency.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.proficiency.deleted.dispatch(this);
    }

}

Proficiency.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            maxlength: 64
        }
    }
};
