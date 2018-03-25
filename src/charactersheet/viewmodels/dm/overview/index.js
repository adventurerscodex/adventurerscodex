import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { Campaign } from 'charactersheet/models';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import largeIcon from 'images/encounters/compass.svg';
import template from './index.html';

export function CampaignOverviewViewModel() {
    var self = this;

    self.largeIcon = largeIcon;

    self.playerName = ko.observable();
    self.createdDate = ko.observable();
    self.setting = ko.observable();
    self.name = ko.observable();

    /* Public Methods */
    self.load = function() {
        var key = CoreManager.activeCore().uuid();
        var overview = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        if (overview) {
            self.playerName(overview.playerName());
            self.name(overview.name());
            self.setting(overview.setting());
            self.createdDate(new Date(overview.createdDate()));
        }

        // Subscriptions
        self.playerName.subscribe(self.save);
        self.setting.subscribe(self.save);
        Notifications.global.save.add(self.save);
    };

    self.save = function() {
        var key = CoreManager.activeCore().uuid();
        var overview = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        if (!overview) {
            overview = new Campaign();
            overview.characterId(key);
        }
        overview.playerName(self.playerName());
        overview.createdDate(self.createdDate());
        overview.setting(self.setting());
        overview.name(self.name());
        overview.save();
    };

    /* UI Methods */

    self.noteText = ko.pureComputed(function() {
        return self.notes() ? self.notes() : '';
    });

    self.placeholderText = ko.pureComputed(function() {
        return 'A Story of Wonder';
    });

    self.timeSinceLabel = ko.pureComputed(function() {
        if (!self.createdDate()) { return ''; }
        var since = self._daysSince(self.createdDate());
        var dateCreated = self.createdDate().toDateString();
        var msg = 'Created on: ' + dateCreated + '.';
        if (since > 0) {
            msg += ' This adventure has been in progress for ' + since + ' days.';
        }
        return msg;
    });

    /* Private Methods */

    self._daysSince = function(day) {
        var now = (new Date()).getTime();
        return Math.round((now-day.getTime())/(1000*60*60*24));
    };
}

ko.components.register('campaign-overview', {
    viewModel: CampaignOverviewViewModel,
    template: template
});
