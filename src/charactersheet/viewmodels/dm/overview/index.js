import 'bin/knockout-custom-loader';
import { Campaign } from 'charactersheet/models';
import { Core } from 'charactersheet/models/common/core';
import { CoreManager } from 'charactersheet/utilities';
import ko from 'knockout';
import largeIcon from 'images/encounters/compass.svg';
import template from './index.html';

export function CampaignOverviewViewModel() {
    var self = this;

    self.largeIcon = largeIcon;

    self.createdDate = ko.observable();
    self.campaign = ko.observable();
    self.core = ko.observable();
    self.loaded = ko.observable(false);

    self.coreHasChanged = ko.observable(false);
    self.campaignHasChanged = ko.observable(false);

    self.data = {};

    /* Public Methods */
    self.load = async function() {
        self.loaded(false);
        await self.reset();

        self.resetSubscriptions();
    };

    self.reset = async () => {
        var key = CoreManager.activeCore().uuid();
        const campaignResponse = await Campaign.ps.read({uuid: key});
        self.campaign(campaignResponse.object);
        self.createdDate(new Date(self.campaign().createdAt()));

        self.core(CoreManager.activeCore());

        self.data = {
            campaign: self.campaign,
            core: self.core
        };

        self.resetSubscriptions();
        self.loaded(true);
    };

    self.resetSubscriptions = () => {
        self.core().playerName.subscribe(self.saveCore);
        self.campaign().setting.subscribe(self.saveCampaign);

        self.campaignHasChanged(false);
        self.coreHasChanged(false);
    };

    self.validation = {
        rules : {
            // Deep copy of properties in object
            ...Core.validationConstraints.rules,
            ...Campaign.validationConstraints.rules
        }
    };

    self.saveCampaign = async () => {
        self.campaignHasChanged(true);
    };

    self.saveCore = async () => {
        self.coreHasChanged(true);
    };

    self.save = async () => {
        if (self.coreHasChanged()) {
            const coreResponse = await self.core().ps.save();
            self.core(coreResponse.object);
        }

        if (self.campaignHasChanged()) {
            const campaignResponse = await self.campaign().ps.save();
            self.campaign(campaignResponse.object);
        }

        self.resetSubscriptions();
    };

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
