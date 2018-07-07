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
    self.campaign = ko.observable();

    /* Public Methods */
    self.load = async function() {
        var key = CoreManager.activeCore().uuid();
        const campaignResponse = await Campaign.ps.read({uuid: key});
        self.campaign(campaignResponse.object);
        if (self.campaign()) {
            self.playerName(CoreManager.activeCore().playerName());
            self.name(self.campaign().name());
            self.setting(self.campaign().setting());
            self.createdDate(new Date(self.campaign().createdAt()));
        }

        // Subscriptions
        self.playerName.subscribe(self.saveCore);
        self.setting.subscribe(self.saveCampaign);
    };

    self.saveCampaign = async () => {
        self.campaign().setting(self.setting());
        self.campaign().ps.save();
    };

    self.saveCore = async () => {
        let core = CoreManager.activeCore();
        core.playerName(self.playerName());
        await core.ps.save();
    }

    /* UI Methods */

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
