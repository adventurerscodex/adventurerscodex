import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import ko from 'knockout';

export class FormController {
    constructor(params) {
        // the container for this form. Used for collapse rows
        this.containerId = params.containerId;
        this.entity = ko.observable(this.generateBlank());
        // Data to be managed by this form
        this.existingData = params.data;
        this.addForm = ko.observable(false);
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity().coreUuid(CoreManager.activeCore().uuid());
            this.addForm(true);
        }
        const noOp = (entity) => {/* no op */};

        this.show = params.show ? params.show : ko.observable(true);
        // Flip Card Properties
        this.flip = params.flip ? params.flip : noOp;
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;
        this.formElementHasFocus = ko.observable(false);

        // Add/Remove callbacks. Used for lists.
        this.addToParent = params.addToParent ? params.addToParent : noOp;
        this.replaceInParent = params.replaceInParent ? params.replaceInParent : noOp;
        this.removeFromParent = params.removeFromParent ? params.removeFromParent : noOp;

        // Text Area style for size reset;
        this.textAreaStyle = ko.observable('');

        this.shouldShowDisclaimer = ko.observable(false);

        // Collects subscriptions to dispose of
        this.subscriptions = [];
    }

    setUpSubscriptions () {
        const onShow = this.show.subscribe(()=>{ this.refresh();});
        this.subscriptions.push(onShow);
        const setFocus = this.show.subscribe(()=>{this.focusOnFlip();});
        this.subscriptions.push(setFocus);
    }

    disposeOfSubscriptions () {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    generateBlank () {
        throw('Generate Blank must be implemented by subclasses of FormViewModel');
    }

    focusOnFlip () {
        this.formElementHasFocus(this.show());
    }

    load () {
        this.setUpSubscriptions();
    }

    refresh() {
        // Reset the textarea size when refreshing
        this.textAreaStyle('');
        this.shouldShowDisclaimer(false);
        if (this.existingData) {
            this.entity().importValues(this.existingData.exportValues());
        } else {
            this.entity(this.generateBlank());
            this.entity().coreUuid(CoreManager.activeCore().uuid());
        }
    }

    async save() {
        if (this.addForm()) {
            const response = await this.entity().ps.create();
            this.addToParent(response.object);
        } else {
            const response = await this.entity().ps.save();
            this.replaceInParent(response.object);
        }
    }

    async submit() {
        await this.save();
        this.flip();
        this.refresh();
        this.notify();
    }

    async delete() {
        if (this.containerId) {
            $(`#${this.containerId}`).collapse('hide');
        }
        await this.entity().ps.delete();
        this.removeFromParent(this.existingData);
        this.notify();
    }

    notify() {}

    reset = () => {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    dispose = () => {
        this.disposeOfSubscriptions();
    }
}
