import autoBind from 'auto-bind';
import {
    Notifications,
    Fixtures,
    uploadFile
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { UserServiceManager } from 'charactersheet/services';
import { observable, components, pureComputed, computed } from 'knockout';
import template from './front.html';

export class MediaManagerViewModel extends ViewModel {

    constructor(params) {
        super();
        autoBind(this);

        this.id = params.containerId || ((Math.random() * 10000) | 0);
        this.flip = params.flip;
        this.forceOuterCardResize = params.forceOuterCardResize;
        this.forceCardResize = params.forceCardResize;
        this.setImageUrl = params.setImageUrl;
        this.fileInputId(`file-${this.id}`);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(
            Notifications.user.exists.add(this.userDidChange)
        );
        this.userDidChange();
    }

    // UI

    State = {
        SELECTING: 'select',
        UPLOADING: 'uploading',
        DONE: 'done',
    };

    state = observable(this.State.SELECTING);

    isActivePatron = observable(false);
    imagesRemaining = observable(0);
    totalImages = observable(0);
    fileInputId = observable('');

    barColor = observable(Fixtures.general.colorHexList[0]);
    progress = observable(0);

    error = observable({});

    isSelecting = pureComputed(() => (this.state() === this.State.SELECTING));
    isUploading = pureComputed(() => (this.state() === this.State.UPLOADING));
    isDone = pureComputed(() => (this.state() === this.State.DONE));

    canUpload = pureComputed(() => this.imagesRemaining() > 0);

    // Actions

    clickFileInput() {
        $(`#${this.fileInputId()}`).click();
    }

    async upload(file) {
        this.state(this.State.UPLOADING);

        try {
            const media = await uploadFile(
                file,
                // Use the Hypnos schema to get the media API URL.
                schema.content.media.create.url,
                this.progress
            );
            this.setImageUrl(media.file);
            this.error(null);

            // Trigger a refresh of account info
            UserServiceManager.sharedService().getAccount();
            Notifications.imagemedia.added.dispatch(media);
        } catch(error) {
            this.error(error);
        }

        this.state(this.State.DONE);
        setTimeout(() => this.reset(), 3000);
    }

    reset() {
        this.state(this.State.SELECTING);
    }

    browse() {
        this.flip();
        setTimeout(this.forceCardResize, 1000);
        setTimeout(this.forceOuterCardResize, 1500);
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


components.register('media-manager-front', {
    viewModel: MediaManagerViewModel,
    template: template
});
