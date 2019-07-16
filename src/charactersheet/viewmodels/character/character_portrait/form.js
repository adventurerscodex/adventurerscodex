import { Core, ProfileImage } from 'charactersheet/models/common';
import { CoreManager, Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
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
        this.showPortrait = ko.observable(false);
        this.selectedStockImage = ko.observableArray();
        this.defaultImages = ko.observableArray(Fixtures.defaultProfilePictures);
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

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.show.subscribe(this.resetShowPortrait));
    }

    resetShowPortrait () {
        if (!this.show()) {
            this.showPortrait(false);
        }
    }

    saveFormHasFocus = ko.pureComputed(()=>(this.formElementHasFocus() && this.showSaves()));
    scoreFormHasFocus = ko.pureComputed(()=>(this.formElementHasFocus() && !this.showSaves()));

    togglePortrait = (newValue) => {
        this.showPortrait(!this.showPortrait());
        this.forceCardResize();
    };


    async save () {
        // await super.save();
        await this.profile().save();
        // playerName is the only editable value of core. Notifying coreManager
        // would cause unintended side effects. So, unlike the other models,
        // Core gets notified here.
        const response = await this.core().ps.save();
        this.core().importValues(response.object.exportValues());
        Notifications.profile.playerName.changed.dispatch(this.core());
    }

    validation = {
        Profile: Profile.validationConstraints.fieldParams,
        Core: Core.validationConstraints.fieldParams
    }
}

ko.components.register('character-portrait-form', {
    viewModel: CharacterPortraitFormModel,
    template: template
});
