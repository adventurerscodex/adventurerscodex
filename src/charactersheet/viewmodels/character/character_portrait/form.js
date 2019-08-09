import { Core, ProfileImage } from 'charactersheet/models/common';
import { CoreManager, Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Profile } from 'charactersheet/models/character';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';

import template from './form.html';

export class CharacterPortraitFormModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.defaultHeight = params.defaultHeight;
        this.profile = ko.observable(new Profile());
        this.core = ko.observable(new Core());

        // Stores the image type since it does not map to the backend 1:1
        this.imageType = ko.observable('');

        this.showStockImages = ko.observable(false);
        this.selectedStockImage = ko.observableArray([]);
        this.stockImages = ko.observableArray(Fixtures.defaultProfilePictures);

        this.imageHeight = 80;
        this.imageWidth = 80;
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
        this.selectedStockImage([]);
        this.configureImages();
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.show.subscribe(this.resetShowStockImages));
        this.subscriptions.push(this.imageType.subscribe(this.toggleShowStockImages));
        this.subscriptions.push(this.selectedStockImage.subscribe(this.stockImageSelected));
    }

    configureImages = () => {
        this.imageType(this.entity().type());
        if (this.entity().type() === 'url' && this.entity().sourceUrl()) {
            const stockImage = find(this.stockImages(), {'image': this.entity().sourceUrl()});
            if (stockImage) {
                this.selectedStockImage().push(stockImage);
                this.imageType('picker');
            }
        }
    }

    resetShowStockImages () {
        if (!this.show()) {
            this.showStockImages(false);
        }
    }

    toggleShowStockImages = (type) => {
        if (type === 'picker') {
            this.entity().type('url');
        } else {
            this.entity().type(this.imageType());
        }
        if (type === 'picker' && !this.showStockImages()) {
            this.showStockImages(true);
            this.forceCardResize();
        } else if (this.showStockImages()); {
            this.showStockImages(false);
            this.forceCardResize();
        }
    };

    stockImageSelected = (imageList) => {
        if (imageList.length > 0) {
            const selectedImage = imageList[0];
            this.entity().sourceUrl(imageList[0].image);
        }
    }

    async save () {
        this.entity().type(this.imageType());
        if (this.imageType() === 'picker') {
            this.entity().type('url');
        }
        if (this.imageType() === 'email') {
            this.entity().sourceUrl(null);
        } else {
            this.entity().email(null);
        }
        await super.save();
        await this.profile().save();
        // playerName is the only editable value of core. Notifying coreManager
        // would cause unintended side effects. So, unlike the other models,
        // Core gets notified here.
        const response = await this.core().ps.save();
        this.core().importValues(response.object.exportValues());
        CoreManager.activeCore().playerName(this.core().playerName());
        this.selectedStockImage([]);
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
