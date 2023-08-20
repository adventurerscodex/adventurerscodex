import { CoreManager, Notifications, uploadFormData, Fixtures } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Encounter, EncounterSection } from 'charactersheet/models/dm';
import { UserServiceManager } from 'charactersheet/services';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './import-form.html';


export class EncounterImportFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.forceCardResize = params.forceCardResize;
    }

    barColor = ko.observable(Fixtures.general.colorHexList[0]);
    progress = ko.observable(0);
    isUploading = ko.observable(false);

    isActivePatron = ko.observable(false);
    imagesRemaining = ko.observable(0);

    mapImageFile = ko.observable();
    dataFile = ko.observable();

    modelClass() {
        return Encounter;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(
            Notifications.user.exists.add(this.userDidChange)
        );
        this.userDidChange();
    }

    async save() {
        let success = true, error = null;

        // The auto-camel-caser doesn't work on multi-part files. We need
        // to use the actual snake-case for this.
        let formData = new FormData();
        formData.append('data_file', this.dataFile());
        if (this.mapImageFile()) {
            formData.append('map_image_file', this.mapImageFile());
        }

        // Use the Hypnos schema to get the import API URL.
        const coreUuid = CoreManager.activeCore().uuid();
        const url = schema.content.core.encounters.fromDonjon.url.replace(
            '{coreUuid}',
            coreUuid,
        );

        try {
            this.isUploading(true);
            const data = await uploadFormData(
                formData,
                url,
                this.progress
            );
            const encounter = new Encounter();
            encounter.importValues(data);
            Notifications.encounter.added.dispatch(encounter);
            this.isUploading(false);
        } catch(e) {
            success = false, error = e;
        }
        this.didSave(success, error);
    }

    didSave(success, error) {
        super.didSave(success, error);

        if (this.forceCardResize) {
            this.forceCardResize();
        }
    }

    // Events

    userDidChange() {
        const user = UserServiceManager.sharedService().user();
        if (user) {
            this.isActivePatron(user.isActivePatron);
            this.imagesRemaining(user.remainingMediaUploads);
        }
    }
}


ko.components.register('encounter-import-form', {
    viewModel: EncounterImportFormViewModel,
    template: template
});
