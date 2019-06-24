import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Profile,
    Status
} from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

export function StatusLineViewModel(params) {
    var self = this;

    self.statusLine = ko.observable('');
    self.character = params.character;

    self.load = function() {
        Notifications.status.changed.add(self.coreHasChanged);
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
        const statuses = PersistenceService.findBy(Status, 'characterId', key);
        if (ko.utils.unwrapObservable(CoreManager.activeCore().type.name) !== 'character') {
            return;
        }
        const profileResponse = await Profile.ps.read({uuid: key});
        let profile = profileResponse.object;

        self.statusLine(self.getStatusLine(profile, statuses));
    };

    self.getStatusLine = function(profile, statuses) {
        if (!profile || statuses.length == 0) { return ''; }

        return profile.characterName() + ' is ' + statuses.map(function(e, i, _) {
            var status = '<span class="text-' + e.type() + '">' + e.name() + '</span>';
            if (statuses.length > 1 && i == statuses.length - 1) {
                return 'and ' + status;
            } else if (statuses.length > 2) {
                return status + ',&nbsp;';
            } else if (statuses.length > 1) {
                return status + '&nbsp;';
            } else {
                return status;
            }
        }).join('') + '.';
    };
}

ko.components.register('player-status-line', {
    viewModel: StatusLineViewModel,
    template: template
});
