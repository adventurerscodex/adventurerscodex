import 'bin/knockout-binding-contenteditable';
import {
    Campaign,
    Profile
} from 'charactersheet/models';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { PlayerTypes } from 'charactersheet/models/common/player_types';
import ko from 'knockout';
import template from './index.html';

export function CharacterNameViewModel() {
    var self = this;

    self.profile = ko.observable();
    self.playerType = ko.observable();
    self.campaign = ko.observable();
    self.name = ko.observable('');

    self.load = async function() {
        Notifications.coreManager.changed.add(self.coreHasChanged);
        await self.coreHasChanged();
    };

    self.placeholderText = ko.pureComputed(function() {
        if (self.playerType() == PlayerTypes.character.key) {
            return '<i>Character Name</i>';
        } else {
            return '<i>A Story of Wonder</i>';
        }
    });

    self.name = ko.computed({
        read: () => {
            if (self.playerType()) {
                if (self.playerType() == PlayerTypes.character.key) {
                    const profile = ko.unwrap(self.profile);
                    return profile ? profile.characterName() : '';
                } else if (self.playerType() == PlayerTypes.dm.key) {
                    const campaign = ko.unwrap(self.campaign);
                    return campaign ? campaign.name() : '';
                }
            }
            return '';
        },
        write: (newValue) => {
            if (self.playerType() == PlayerTypes.character.key) {
                const profile = ko.unwrap(self.profile);
                profile.characterName(newValue);
                profile.ps.save();
            } else if (self.playerType() == PlayerTypes.dm.key) {
                const campaign = ko.unwrap(self.campaign);
                campaign.name(newValue);
                campaign.ps.save();
            }
        }
    });

    self.coreHasChanged = async function() {
        var core = CoreManager.activeCore();
        self.playerType(core.type.name());
        if (core.type.name() == PlayerTypes.character.key) {
            const response = await Profile.ps.read({ uuid: core.uuid() });
            self.profile(response.object);
        } else if (core.type.name() == PlayerTypes.dm.key) {
            const response = await Campaign.ps.read({ uuid: core.uuid() });
            self.campaign(response.object);
        }
    };
}

ko.components.register('character-name', {
    viewModel: CharacterNameViewModel,
    template: template
});
