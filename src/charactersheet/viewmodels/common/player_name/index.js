import 'bin/knockout-binding-contenteditable';
import {
    Campaign,
    Profile
} from 'charactersheet/models';
import { CoreManager,
    Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

export function PlayerNameViewModel() {
    var self = this;

    self.profile = ko.observable();
    self.playerType = ko.observable();
    self.campaign = ko.observable();
    self.name = ko.observable('');

    self.load = function() {
        Notifications.coreManager.changed.add(self.coreHasChanged);
        self.coreHasChanged();
    };

    self.placeholderText = ko.pureComputed(function() {
        if (self.playerType() == 'character') {
            return '<i>Character Name</i>';
        } else {
            return '<i>A Story of Wonder</i>';
        }
    });

    self.name = ko.computed({
        read: () => {
            const profile = ko.unwrap(self.profile);
            if (profile) {
                return profile.characterName();
            }
            const campaign = ko.unwrap(self.campaign);
            if (campaign) {
                return campaign.name();
            }
            return '';
        },
        write: (newValue) => {
            const profile = ko.unwrap(self.profile);
            if (profile) {
                profile.characterName(newValue);
                profile.ps.save();
            }
            const campaign = ko.unwrap(self.campaign);
            if (campaign) {
                campaign.characterName(newValue);
                campaign.ps.save();
            }
        }
    });

    self.coreHasChanged = function() {
        var core = CoreManager.activeCore();
        self.playerType(core.type.name());

        if (core.type.name() == 'character') {
            Profile.ps.read({ uuid: core.uuid() }).then(response => {
                self.profile(response.object);
            });
        } else if (core.type.name() == 'dm') {
            Campaign.ps.read({ uuid: core.uuid() }).then(response => {
                self.campaign(response.object);
            });
        }
    };
}

ko.components.register('player-name', {
    viewModel: PlayerNameViewModel,
    template: template
});
