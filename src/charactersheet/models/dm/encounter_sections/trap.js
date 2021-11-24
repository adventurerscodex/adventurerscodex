import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications } from 'charactersheet/utilities';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class Trap extends KOModel {
    static __skeys__ = ['core', 'encounters', 'traps'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: [
            'coreUuid',
            'encounterUuid',
            'uuid',
            'name',
            'level',
            'threat',
            'trigger',
            'effect',
            'countermeasure',
            'description',
            'initiative',
            'activeElements',
            'dynamicElements',
            'constantElements',
            'isActive'
        ]
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();

    name = ko.observable();
    level = ko.observable();
    threat = ko.observable();
    trigger = ko.observable();
    effect = ko.observable();
    countermeasure = ko.observable();
    description = ko.observable();
    initiative = ko.observable();
    activeElements = ko.observable();
    dynamicElements = ko.observable();
    constantElements = ko.observable();
    isActive = ko.observable(true);

    /* UI Methods */

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.description(),
            this.LONG_DESCRIPTION_MAX_LENGTH
        );
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.description(),
            this.SHORT_DESCRIPTION_MAX_LENGTH
        );
    });

    longEffect = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.effect(),
            this.LONG_DESCRIPTION_MAX_LENGTH
        );
    });

    shortEffect = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.effect(),
            this.SHORT_DESCRIPTION_MAX_LENGTH
        );
    });

    longTrigger = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.trigger(),
            this.LONG_DESCRIPTION_MAX_LENGTH
        );
    });

    shortTrigger = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.trigger(),
            this.SHORT_DESCRIPTION_MAX_LENGTH
        );
    });

    nameLabel = ko.pureComputed(() => {
        if (this) {
            if (this.isActive()) {
                return 'Armed';
            } else {
                return 'Disarmed';
            }
        }
    });

    // determines if the "More Fields" div is collapsed or expanded in the edit form
    // based on the presence of the "complex" trap fields
    shouldShowMoreFields = ko.pureComputed(() => {
        return this /* Ensure we have a context */ && (
            this.initiative()
            || this.activeElements()
            || this.dynamicElements()
            || this.constantElements()
        );
    });

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.trap.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.trap.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.trap.deleted.dispatch(this);
    }
}

Trap.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        level: {
            maxlength: 256
        },
        threat: {
            maxlength: 256
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        level: {
            maxlength: 256
        },
        threat: {
            maxlength: 256
        }
    }
};
