import autoBind from 'auto-bind';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Elaboration } from 'charactersheet/models/common';
import { Notifications } from 'charactersheet/utilities';
import { UserServiceManager } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

const noop = function() {};

class ElaborationViewModel extends ViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.isLoading = ko.observable(true);
        this.elaboration = ko.observable();
        this.remainingElaborations = ko.observable(false);
        this.userIsPatron = ko.observable(false);

        this.context = params.context;
        this.type = params.type;
        this.uuid = params.uuid;
        this.open = params.open || noop;
        this.onselect = params.onselect || noop;
        this.onupdate = params.onupdate || noop;
        this.oncancel = params.oncancel || noop;
    }

    async load() {
        await super.load();
        this.elaborate();
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(
            Notifications.user.exists.add(this.userDidChange)
        );
        this.userDidChange();
    }

    userHasReachedLimits = ko.pureComputed(() => (
        this.remainingElaborations() === 0
    ));

    remaining = ko.pureComputed(() => (
        `You have ${this.remainingElaborations()} remaining uses this month.`
    ));

    hasContext = ko.pureComputed(() => !!this.context());

    async elaborate() {
        this.isLoading(true);
        try {
            const response = await Elaboration.ps.create({
                uuid: ko.unwrap(this.uuid),
                type: ko.unwrap(this.type),
                context: ko.unwrap(this.context) || '',
            });
            this.elaboration(response.object);
        } catch (error) {
            console.log(error);
        }
        this.isLoading(false);

        // Refresh the user's stats.
        UserServiceManager.sharedService().getAccount();
    }

    useElaboration() {
        this.onselect(this.elaboration());
        this.elaboration(null);
    }

    resetElaboration() {
        this.oncancel();
        this.elaboration(null);
    }

    // Events

    userDidChange() {
        const user = UserServiceManager.sharedService().user();
        if (user) {
            this.userIsPatron(user.isActivePatron);
            this.remainingElaborations(user.remainingElaborations);
        }
    }
}


ko.components.register('elaboration', {
    viewModel: ElaborationViewModel,
    template: template
});
