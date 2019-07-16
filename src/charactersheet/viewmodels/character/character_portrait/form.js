import { Core, ProfileImage } from 'charactersheet/models/common';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { Profile } from 'charactersheet/models/character';
import autoBind from 'auto-bind';
import ko from 'knockout';

import template from './form.html';


export class CharacterPortraitFormModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.defaultHeight = params.defaultHeight;
        this.profile = ko.observable(new Profile());
        this.core = ko.observable(new Core());
        autoBind(this);
    }

    modelClass () {
        return ProfileImage;
    }

    generateBlank() {
        const thisClazz = this.modelClass();
        const newEntity = new thisClazz();
        return newEntity;
    }

    async refresh () {
        await super.refresh();
        await this.profile().load({uuid: CoreManager.activeCore().uuid()});
        await this.core().importValues(CoreManager.activeCore().exportValues());
    }

    async save () {
        // await super.save();
        await this.profile().save();
        const response = await this.core().ps.save();
        self.core().importValues(coreResponse.object.exportValues());
        Notifications.core.changed(self.core());
    }

    validation = {
        Profile: Profile.validationConstraints.fieldParams
        // Core: Core.validationConstraints.fieldParams
    }
}

ko.components.register('character-portrait-form', {
    viewModel: CharacterPortraitFormModel,
    template: template
});
