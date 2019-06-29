import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Profile,
    Status
} from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { debounce } from 'lodash';
import ko from 'knockout';

export function StatusLineViewModel(params) {
    var self = this;

    self.statusLine = ko.observable('');
    self.character = params.character;
    self.profile = ko.observable();

    self.load = function() {
        self.profile(new Profile());
        Notifications.status.changed.add(debounce(self.statusHasChanged, 200));
        self.character.subscribe(self.coreHasChanged);
        self.coreHasChanged();
    };

    self.unload = function() {
        Notifications.status.changed.remove(self.coreHasChanged);
        self.clear();
    };

    self.clear = function() {
        self.statusLine('');
    };

    // Private Methods
    self.coreHasChanged = async () => {
        const key = CoreManager.activeCore().uuid();
        await self.profile().load({uuid: key});
        self.statusHasChanged();
    };

    self.statusHasChanged = () => {
        const key = CoreManager.activeCore().uuid();
        const statuses = PersistenceService.findBy(Status, 'characterId', key);
        if (ko.utils.unwrapObservable(CoreManager.activeCore().type.name) !== 'character') {
            return;
        }
        self.statusLine(self.getStatusLine(statuses));
    };

    self.prettyStatus = (status) => {
        return `<span class="text-${status.type()}">${status.name()}</span>`;
    };

    self.oxfordList = (arr) => {
        const lastStatus = arr.pop();
        if (!arr.length) {
            return lastStatus;
        }
        return `${arr.join(',&nbsp; ')} and ${lastStatus}`;
    };

    self.getStatusLine = function(statuses) {
        if (!ko.utils.unwrapObservable(self.profile).characterName || statuses.length == 0) {
            return '';
        }

        return `${self.profile().characterName()} is ${self.oxfordList(statuses.map(self.prettyStatus))}.`;
    };
}

ko.components.register('player-status-line', {
    viewModel: StatusLineViewModel,
    template: '<span data-bind="html: statusLine"></span>'
});
