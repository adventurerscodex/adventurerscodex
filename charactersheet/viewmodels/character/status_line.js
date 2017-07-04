'use strict';

function StatusLineViewModel() {
    var self = this;

    self.statusLine = ko.observable('');

    self.load = function() {
        Notifications.status.changed.add(self.dataHasChanged);
    };

    self.unload = function() {
        Notifications.status.changed.remove(self.dataHasChanged);
        self.clear();
    };

    self.clear = function() {
        self.statusLine('');
    };

    // Private Methods

    self.dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var statuses = PersistenceService.findBy(Status, 'characterId', key);
        var profile = PersistenceService.findBy(Profile, 'characterId', key)[0];

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
