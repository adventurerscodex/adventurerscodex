import { Core, ProfileImage } from 'charactersheet/models/common';
import { CoreManager, Fixtures, Notifications } from 'charactersheet/utilities';
import { PartyService } from 'charactersheet/services/common/account/party_service';
import { AbstractFormModel } from 'charactersheet/viewmodels/abstract';
import { Campaign } from 'charactersheet/models/dm';
import autoBind from 'auto-bind';
import { find } from 'lodash';
import ko from 'knockout';

import template from './form.html';

export class CampaignPortraitFormModel extends AbstractFormModel {
    constructor(params) {
        super(params);
        this.defaultHeight = params.defaultHeight;
        this.campaign = ko.observable(new Campaign());
        this.core = ko.observable(new Core());

        // Stores the image type since it does not map to the backend 1:1
        this.imageType = ko.observable('');
        this.headerImageType = ko.observable('');

        this.showStockImages = ko.observable(false);
        this.selectedStockImage = ko.observableArray([]);
        this.stockImages = ko.observableArray(Fixtures.defaultProfilePictures);

        this.imageHeight = 80;
        this.imageWidth = 80;

        this.showStockHeaderImages = ko.observable(false);
        this.selectedStockHeaderImage = ko.observableArray([]);
        this.stockHeaderImages = ko.observableArray(Fixtures.defaultHeaderImages);

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

    async refresh() {
        await super.refresh();
        await this.campaign().load({uuid: CoreManager.activeCore().uuid()});
        await this.core().importValues(CoreManager.activeCore().exportValues());
        this.selectedStockImage([]);
        this.selectedStockImage([]);
        this.configureImages();
        this.configureHeaderImages();
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(this.show.subscribe(this.resetShowStockImages));
        this.subscriptions.push(this.imageType.subscribe(this.toggleShowStockImages));
        this.subscriptions.push(this.selectedStockImage.subscribe(this.stockImageSelected));
        this.subscriptions.push(this.headerImageType.subscribe(this.toggleShowStockHeaderImages));
        this.subscriptions.push(this.selectedStockHeaderImage.subscribe(this.stockHeaderImageSelected));

    }

    // Profile Images

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
            this.showStockHeaderImages(false);
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
            this.entity().sourceUrl(imageList[0].image);
        }
    }

    // Header Images

    configureHeaderImages = () => {
        this.imageType(this.entity().type());
        if (this.entity().type() === 'url' && this.entity().sourceUrl()) {
            const stockImage = find(this.stockImages(), {'image': this.entity().sourceUrl()});
            if (stockImage) {
                this.selectedStockImage().push(stockImage);
                this.imageType('picker');
            }
        }
    }

    toggleShowStockHeaderImages = (type) => {
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

    stockHeaderImageSelected = (imageList) => {
        if (imageList.length > 0) {
            this.campaign().headerImageUrl(imageList[0].image);
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
        await this.campaign().save();
        // playerName is the only editable value of core. Notifying coreManager
        // would cause unintended side effects. So, unlike the other models,
        // Core gets notified here.
        const response = await this.core().ps.save();
        this.core().importValues(response.object.exportValues());
        CoreManager.activeCore().playerName(this.core().playerName());
        this.selectedStockImage([]);
        Notifications.campaign.playerName.changed.dispatch(this.core());

        // Poke the party to notify of any out-of-band changes
        // like the header image changing that needs refresh.
        PartyService.updatePresence();
    }

    validation = {
        Campaign: Campaign.validationConstraints.fieldParams,
        Core: Core.validationConstraints.fieldParams
    }
}

ko.components.register('dm-portrait-form', {
    viewModel: CampaignPortraitFormModel,
    template: template
});
