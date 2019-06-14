import ko from 'knockout';

export class AbstractFormModel {
    constructor(params) {
        // Data to be managed by this form
        const noOp = (entity) => { /* no op */ };

        /* flip card parameters; use if part of a flip card */
        /* Flag for whether this side of a flip-card is shown */
        this.show = params.show ? params.show : ko.observable(true);
        /* Function that will flip a card (or collapse a row) */
        this.flip = params.flip ? params.flip : noOp;
        /* Callback to resize the card, as it is absolutely positioned */
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;

        /* Model Name supports creating form tables with multiple objects
           This is a hack that allows modelName to be available for tracked form */
        /* A class name that is a string */
        this.modelName = params.modelName ? params.modelName : null; // null if unused

        /* The item being edited */
        this.entity = ko.observable(this.generateBlank());

        /* Flag to denote an "Add Form" to create a new entry */
        this.addForm = ko.observable(false);
        /* Flag for focusing the marked element on a form, generally the first */
        this.formElementHasFocus = ko.observable(false);
        /* Flag to display disclaimer */
        this.showDisclaimer = ko.observable(false);

        // Collects subscriptions to dispose of
        this.subscriptions = [];
        this.listeners = [];
    }

    modelClass () {
        /* Halfway to replacing 'generateBlank' in children */
        throw('Model Class must be defined');
    }

    generateBlank() {
        /* Create a new instance of a class for data to be imported */
        return this.modelClass()();
//                throw ('Generate Blank must be implemented by subclasses of FormViewModel');
    }

    setUpSubscriptions() {
        /* callback for when this form becomes visible */
        const onShow = this.show.subscribe(this.refreshOnShow);
        this.subscriptions.push(onShow);
        /* callback to focus a field when form becomes visible */
        const setFocus = this.show.subscribe(this.focusOnFlip);
        this.subscriptions.push(setFocus);
        /* callback to resize when the disclaimer is shown */
        const showDisclaimerResize = this.showDisclaimer.subscribe(this.delayThenResize);
        this.subscriptions.push(showDisclaimerResize);
    }

    delayThenResize = () => {
        // Handle for browser order of operations so we don't calculate size
        // before the view is ready
        setTimeout(this.forceCardResize, 150);
    }

    reviewInput = (data, event) => {
        if (event.target.checkValidity()) {
            event.target.classList.remove('error');
        } else {
            event.target.classList.add('error');
        }
    }

    invalidate = (data, event) => {
        event.target.classList.add('error');
        return true; // Continue validating
    }

    refreshOnShow = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }

    disposeOfSubscriptions() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
        this.listeners.forEach((listener) => listener.remove());
        this.listeners = [];
    }

    focusOnFlip = () => {
        const setFocus = () => {
            this.formElementHasFocus(this.show());
        };
        setTimeout(setFocus, 450);
    }

    load() {
        this.setUpSubscriptions();
    }

    async submit() {
        /* The form submit function */
        await this.save();
        // Flipping will automatically via subscription refresh dependent views
        this.flip();
        this.notify();
    }

    async refresh () {
        this.showDisclaimer(false);
    }

    async save() {
        const response = await this.entity().ps.save();
        // TODO: Why check entity is null?
        if (this.entity() != null) {
            this.entity().importValues(response.object.exportValues());
        } else {
            this.entity(response.object);
        }
    }

    notify() {}

    reset() {
        /* Reset/Cancel buttons on all forms */
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    dispose() {
        this.disposeOfSubscriptions();
    }
}
